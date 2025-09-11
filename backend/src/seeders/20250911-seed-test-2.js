
'use strict';

/**
 * Seeder Sequelize — données pour le mois courant
 *
 * Usage:
 *   npx sequelize db:seed:all
 *
 * Notes:
 * - Crée les users manquants (alice/bob/charlie/dora/john@doe.fr) si absent (mot de passe plain indiqué dans les logs).
 * - N'écrase PAS le mot de passe d'un user déjà existant.
 * - Les enregistrements ajoutés contiennent "seed-current-month" dans la description pour faciliter le down().
 */

const bcrypt = require('bcrypt');

function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function randomAmount(min = 3, max = 300) {
  return parseFloat(randBetween(min, max).toFixed(2));
}
function randomDateBetween(startISO, endISO) {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const t = Math.floor(randBetween(start, end));
  return new Date(t).toISOString().slice(0, 10); // YYYY-MM-DD
}

module.exports = {
  up: async (queryInterface /* , Sequelize */) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();
      const todayISO = now.toISOString().slice(0, 10);

      // Début du mois courant
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayISO = firstDay.toISOString().slice(0, 10);

      // Utilisateurs cibles
      const targetEmails = [
        'alice@example.com',
        'bob@example.com',
        'charlie@example.com',
        'dora@example.com',
        'john@doe.fr'
      ];

      // Si on doit créer des users manquants, on utilisera ces mots de passe (loggués)
      const defaultPasswords = {
        'alice@example.com': 'Password123!',
        'bob@example.com': 'Password123!',
        'charlie@example.com': 'Password123!',
        'dora@example.com': 'Password123!',
        'john@doe.fr': 'JohnSeed!234'
      };

      // 1) Récupérer ou créer les users
      const users = []; // { id, email, createdBySeeder: boolean, plainPassword?: string }
      for (const email of targetEmails) {
        const [rows] = await queryInterface.sequelize.query(
          `SELECT id, email FROM "Users" WHERE email = :email LIMIT 1;`,
          { replacements: { email }, transaction }
        );
        if (rows && rows.length > 0) {
          users.push({ id: rows[0].id, email: rows[0].email, createdBySeeder: false });
        } else {
          // créer l'utilisateur
          const plain = defaultPasswords[email] || 'Password123!';
          const hashed = await bcrypt.hash(plain, 10);
          await queryInterface.bulkInsert('Users', [{
            email,
            password: hashed,
            createdAt: now,
            updatedAt: now,
          }], { transaction });
          const [newRows] = await queryInterface.sequelize.query(
            `SELECT id, email FROM "Users" WHERE email = :email LIMIT 1;`,
            { replacements: { email }, transaction }
          );
          users.push({ id: newRows[0].id, email: newRows[0].email, createdBySeeder: true, plainPassword: plain });
        }
      }

      // 2) Pour chaque user : s'assurer d'avoir quelques categories "seed-this-month-<name>"
      const seedCategoryNames = ['Nourriture (seed-month)', 'Transport (seed-month)', 'Loisirs (seed-month)', 'Autres (seed-month)'];
      const categoriesToInsert = [];
      for (const u of users) {
        for (const name of seedCategoryNames) {
          categoriesToInsert.push({
            name,
            description: `Catégorie seed du mois pour ${u.email}`,
            userId: u.id,
            createdAt: now,
            updatedAt: now,
          });
        }
      }
      // Insert categories en évitant les duplicates via try/catch (index unique name+userId)
      try {
        await queryInterface.bulkInsert('Categories', categoriesToInsert, { transaction });
      } catch (err) {
        // probablement des duplicates — ignore, on récupérera ensuite les catégories existantes
      }

      // Récupérer categories insérées/existantes pour ces users
      const [dbCategories] = await queryInterface.sequelize.query(
        `SELECT id, name, "userId" FROM "Categories" WHERE name IN (${seedCategoryNames.map(() => '?').join(',')});`,
        { replacements: seedCategoryNames, transaction }
      );

      // Map userId -> categoryIds
      const catMap = {};
      for (const c of dbCategories) {
        catMap[c.userId] = catMap[c.userId] || [];
        catMap[c.userId].push(c.id);
      }

      // 3) Créer incomes et expenses pour chaque user (dates aléatoires entre firstDayISO et todayISO)
      const incomesRows = [];
      const expensesRows = [];

      for (const u of users) {
        // incomes: 1-3
        const incomesCount = Math.floor(randBetween(1, 4)); // 1..3
        for (let i = 0; i < incomesCount; i++) {
          incomesRows.push({
            amount: randomAmount(100, 3000),
            date: randomDateBetween(firstDayISO, todayISO),
            source: ['Salaire', 'Freelance', 'Vente'][Math.floor(Math.random() * 3)],
            description: `seed-current-month income ${i + 1} for ${u.email}`,
            creationDate: now,
            userId: u.id,
            createdAt: now,
            updatedAt: now,
          });
        }

        // expenses: 5-12
        const expensesCount = Math.floor(randBetween(5, 13)); // 5..12
        for (let i = 0; i < expensesCount; i++) {
          const isRecurring = Math.random() < 0.15;
          if (isRecurring) {
            const startDate = randomDateBetween(firstDayISO, todayISO);
            // endDate sometimes null or later in month
            const hasEnd = Math.random() < 0.5;
            const endDate = hasEnd ? randomDateBetween(startDate, todayISO) : null;
            expensesRows.push({
              amount: randomAmount(5, 300),
              description: `seed-current-month recurring expense ${i + 1} for ${u.email}`,
              type: 'Recurring',
              startDate,
              endDate,
              userId: u.id,
              // categoryId assigned below
              createdAt: now,
              updatedAt: now,
            });
          } else {
            const date = randomDateBetween(firstDayISO, todayISO);
            expensesRows.push({
              amount: randomAmount(1, 350),
              date,
              description: `seed-current-month one-time expense ${i + 1} for ${u.email}`,
              type: 'OneTime',
              userId: u.id,
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      }

      // Assigner categoryId aléatoire aux expenses (si aucune catégorie pour l'user, fallback à null -> on évitera car categoryId non null)
      // Si un user n'a pas de categories (improbable), on créera une category fallback.
      for (const u of users) {
        if (!catMap[u.id] || catMap[u.id].length === 0) {
          // créer fallback
          const fallback = {
            name: `Fallback (seed-month)`,
            description: `Fallback category for ${u.email}`,
            userId: u.id,
            createdAt: now,
            updatedAt: now,
          };
          await queryInterface.bulkInsert('Categories', [fallback], { transaction });
          const [rows] = await queryInterface.sequelize.query(
            `SELECT id FROM "Categories" WHERE name = :name AND "userId" = :uid LIMIT 1;`,
            { replacements: { name: fallback.name, uid: u.id }, transaction }
          );
          catMap[u.id] = [rows[0].id];
        }
      }

      // Now assign categoryId
      for (const exp of expensesRows) {
        const list = catMap[exp.userId] || [];
        exp.categoryId = list[Math.floor(Math.random() * list.length)];
      }

      // Bulk insert incomes & expenses (en batches si besoin)
      if (incomesRows.length > 0) {
        await queryInterface.bulkInsert('Incomes', incomesRows, { transaction });
      }
      if (expensesRows.length > 0) {
        // batch insert to be safe
        const batchSize = 200;
        for (let i = 0; i < expensesRows.length; i += batchSize) {
          const batch = expensesRows.slice(i, i + batchSize);
          await queryInterface.bulkInsert('Expenses', batch, { transaction });
        }
      }

      await transaction.commit();

      // Log credentials for users created by this seeder
      console.log('--- seed-current-month terminé ✅ ---');
      console.log(`Période: ${firstDayISO} -> ${todayISO}`);
      for (const u of users) {
        if (u.createdBySeeder) {
          console.log(`Utilisateur créé: ${u.email}  mot-de-passe (plain): ${u.plainPassword}`);
        } else {
          console.log(`Utilisateur existant utilisé: ${u.email} (id=${u.id})`);
        }
      }
      console.log('Incomes ajoutés:', incomesRows.length, 'Expenses ajoutés:', expensesRows.length);
    } catch (err) {
      await transaction.rollback();
      console.error('Erreur seeder month-current:', err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Supprime uniquement les incomes/expenses insérés par ce seeder (description contient 'seed-current-month')
      await queryInterface.bulkDelete('Incomes', { description: { [Sequelize.Op.iLike]: '%seed-current-month%' } }, { transaction });
      await queryInterface.bulkDelete('Expenses', { description: { [Sequelize.Op.iLike]: '%seed-current-month%' } }, { transaction });

      // Supprimer categories créées par ce seeder (nom contient '(seed-month)') — prudence: seulement celles sans autres dependencies
      // On supprime par name pattern
      await queryInterface.bulkDelete('Categories', { name: { [Sequelize.Op.iLike]: '%(seed-month)%' } }, { transaction });

      // Supprimer les users créés par ce seeder (alice,bob,charlie,dora,john si créé ici) :
      // MAIS pour sécurité ne pas supprimer un john@doe.fr qui existait déjà avant — on supprime uniquement les users avec email exact et
      // qui n'ont AUCUNE autre expenses/incomes left (précaution).
      const candidateEmails = ['alice@example.com','bob@example.com','charlie@example.com','dora@example.com','john@doe.fr'];
      const [foundUsers] = await queryInterface.sequelize.query(
        `SELECT id, email FROM "Users" WHERE email IN (${candidateEmails.map(() => '?').join(',')});`,
        { replacements: candidateEmails, transaction }
      );

      const idsToMaybeDelete = [];
      for (const u of foundUsers) {
        // vérifier s'il reste des incomes/expenses pour ce user (autres que seed-current-month)
        const [[incCount]] = await queryInterface.sequelize.query(
          `SELECT COUNT(*)::int as cnt FROM "Incomes" WHERE "userId" = :uid AND description NOT ILIKE '%seed-current-month%';`,
          { replacements: { uid: u.id }, transaction }
        );
        const [[expCount]] = await queryInterface.sequelize.query(
          `SELECT COUNT(*)::int as cnt FROM "Expenses" WHERE "userId" = :uid AND description NOT ILIKE '%seed-current-month%';`,
          { replacements: { uid: u.id }, transaction }
        );

        // si aucun autre revenu/dépense (=> utilisateur probablement créé par le seeder), on peut supprimer
        if ((incCount.cnt === 0 || incCount.cnt === 0) && (expCount.cnt === 0 || expCount.cnt === 0)) {
          idsToMaybeDelete.push(u.id);
        }
      }

      if (idsToMaybeDelete.length > 0) {
        // supprimer categories, incomes, expenses liés à ces users (déjà supprimés les seed-current-month)
        await queryInterface.bulkDelete('Categories', { userId: idsToMaybeDelete }, { transaction });
        await queryInterface.bulkDelete('Incomes', { userId: idsToMaybeDelete }, { transaction });
        await queryInterface.bulkDelete('Expenses', { userId: idsToMaybeDelete }, { transaction });
        await queryInterface.bulkDelete('Users', { id: idsToMaybeDelete }, { transaction });
        console.log('Down: supprimé utilisateurs créés par le seeder (si aucun autre data existant).');
      } else {
        console.log('Down: aucun utilisateur sûr à supprimer (ils avaient déjà d’autres données).');
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error('Erreur down seed-current-month:', err);
      throw err;
    }
  }
};
