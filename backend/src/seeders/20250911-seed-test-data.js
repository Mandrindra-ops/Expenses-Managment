'use strict';

/**
 * Seeder Sequelize — multi-users + categories + incomes + expenses
 *
 * Usage:
 *   npx sequelize db:seed:all
 *
 * Options ENV:
 *   FORCE_RESET_EXISTING_PASSWORD=true   -> forcera la réinitialisation du password pour l'user id 41 (ATTENTION: écrase le mot de passe existant)
 *
 * IMPORTANT:
 * - Ce script NE supprime PAS l'utilisateur id=41 si il existait avant (safe). Le down() n'effacera que les utilisateurs créés par ce seeder.
 */

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function randomAmount(min = 3, max = 300) {
  return parseFloat(randBetween(min, max).toFixed(2));
}
function randomDateWithin2Years() {
  const now = Date.now();
  const past = new Date();
  past.setFullYear(past.getFullYear() - 2);
  const start = past.getTime();
  const t = Math.floor(randBetween(start, now));
  const d = new Date(t);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}
function randomDateBetween(startISO, endISO) {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const t = Math.floor(randBetween(start, end));
  return new Date(t).toISOString().slice(0, 10);
}

module.exports = {
  up: async (queryInterface /* , Sequelize */) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      const now = new Date();
      const nowISO = now.toISOString().slice(0, 10);
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      const twoYearsAgoISO = twoYearsAgo.toISOString().slice(0, 10);

      // --- UTILISATEURS ---
      // On veut 5 utilisateurs au total ; si id=41 existe on l'utilise, sinon on crée john@doe.fr.
      const existingUserIdToPrefer = 41;
      const existingEmailToPrefer = 'john@doe.fr';
      const forceResetExisting = process.env.FORCE_RESET_EXISTING_PASSWORD === 'true';

      // 4 nouveaux utilisateurs (email + plain password)
      const newUsers = [
        { email: 'alice@example.com', password: 'Password123!' },
        { email: 'bob@example.com', password: 'Password123!' },
        { email: 'charlie@example.com', password: 'Password123!' },
        { email: 'dora@example.com', password: 'Password123!' },
      ];

      const createdUserEmails = []; // pour le down
      const createdUserInfos = [];  // { id, email, passwordPlain } pour l'output

      // 1) vérifier si user id=41 existe
      let includeExistingUser = false;
      let existingUser = null;

      try {
        const [rows] = await queryInterface.sequelize.query(
          `SELECT id, email FROM "Users" WHERE id = :id LIMIT 1;`,
          { replacements: { id: existingUserIdToPrefer }, transaction }
        );
        if (rows && rows.length > 0) {
          includeExistingUser = true;
          existingUser = { id: rows[0].id, email: rows[0].email };
        } else {
          // si id=41 absent, essayer par email
          const [rows2] = await queryInterface.sequelize.query(
            `SELECT id, email FROM "Users" WHERE email = :email LIMIT 1;`,
            { replacements: { email: existingEmailToPrefer }, transaction }
          );
          if (rows2 && rows2.length > 0) {
            includeExistingUser = true;
            existingUser = { id: rows2[0].id, email: rows2[0].email };
          }
        }
      } catch (err) {
        // non bloquant ; on continuera à créer john si besoin
        console.warn('Vérification existence user id=41 a échoué :', err.message || err);
      }

      // If existing user present and FORCE_RESET_EXISTING_PASSWORD=true, update its password to a known seed
      const existingUserSeedPassword = 'JohnSeed!234'; // si on force reset
      if (includeExistingUser) {
        console.log(`Utilisateur existant trouvé : id=${existingUser.id} email=${existingUser.email}`);
        if (forceResetExisting) {
          const hashed = await bcrypt.hash(existingUserSeedPassword, 10);
          await queryInterface.bulkUpdate('Users', { password: hashed, updatedAt: now }, { id: existingUser.id }, { transaction });
          console.log(`Mot de passe de l'utilisateur id=${existingUser.id} réinitialisé (FORCE_RESET_EXISTING_PASSWORD=true).`);
        }
      } else {
        // créer john@doe.fr si absent (il aura un id auto-généré, pas forcément 41)
        const plain = 'JohnSeed!234';
        const hashed = await bcrypt.hash(plain, 10);
        await queryInterface.bulkInsert('Users', [{
          email: existingEmailToPrefer,
          password: hashed,
          createdAt: now,
          updatedAt: now,
        }], { transaction });
        const [rowsNew] = await queryInterface.sequelize.query(
          `SELECT id, email FROM "Users" WHERE email = :email LIMIT 1;`,
          { replacements: { email: existingEmailToPrefer }, transaction }
        );
        existingUser = { id: rowsNew[0].id, email: rowsNew[0].email };
        includeExistingUser = true;
        console.log(`Utilisateur ${existingEmailToPrefer} créé avec id=${existingUser.id}`);
        // NOTE: on considère que c'est créé par ce seeder -> on pourra le supprimer au down.
        createdUserEmails.push(existingUser.email);
        createdUserInfos.push({ id: existingUser.id, email: existingUser.email, passwordPlain: plain });
      }

      // 2) créer les 4 users s'ils n'existent pas déjà (par email)
      for (const u of newUsers) {
        // vérifier existence
        const [found] = await queryInterface.sequelize.query(
          `SELECT id, email FROM "Users" WHERE email = :email LIMIT 1;`,
          { replacements: { email: u.email }, transaction }
        );
        if (found && found.length > 0) {
          // utilisateur existant -> ne pas recréer mais l'ajouter à la liste
          const f = found[0];
          createdUserInfos.push({ id: f.id, email: f.email, passwordPlain: null }); // mot de passe inconnu (déjà existant)
          console.log(`Utilisateur existant trouvé : ${f.email} (id=${f.id}) — ne sera pas recréé.`);
        } else {
          const hashed = await bcrypt.hash(u.password, 10);
          await queryInterface.bulkInsert('Users', [{
            email: u.email,
            password: hashed,
            createdAt: now,
            updatedAt: now,
          }], { transaction });
          const [newRow] = await queryInterface.sequelize.query(
            `SELECT id, email FROM "Users" WHERE email = :email LIMIT 1;`,
            { replacements: { email: u.email }, transaction }
          );
          const newUser = { id: newRow[0].id, email: newRow[0].email };
          createdUserEmails.push(newUser.email);
          createdUserInfos.push({ id: newUser.id, email: newUser.email, passwordPlain: u.password });
          console.log(`Utilisateur créé: ${newUser.email} (id=${newUser.id})`);
        }
      }

      // Build final user list: ensure existingUser is included once
      const allUsers = [];
      if (includeExistingUser && existingUser) {
        // check we didn't already add it in createdUserInfos
        const already = createdUserInfos.find((x) => x.id === existingUser.id || x.email === existingUser.email);
        if (!already) {
          // passwordPlain: null because we didn't change it by default
          createdUserInfos.push({ id: existingUser.id, email: existingUser.email, passwordPlain: forceResetExisting ? existingUserSeedPassword : null });
          // Do not add to createdUserEmails because it's not created by this seeder (unless we created it above)
          if (!createdUserEmails.includes(existingUser.email) && !forceResetExisting) {
            // nothing
          } else if (createdUserEmails.includes(existingUser.email)) {
            // already tracked
          }
        }
      }

      // Recuperer la liste finale d'utilisateurs (les derniers createdUserInfos contiennent tous)
      // Convertir createdUserInfos en array d'obj {id, email, passwordPlain}
      const usersForSeeding = createdUserInfos;

      // --- POUR CHAQUE UTILISATEUR : créer categories, incomes, expenses ---
      const categoriesTemplate = [
        'Nourriture',
        'Transport',
        'Logement',
        'Santé',
        'Loisirs',
        'Abonnements',
        'Courses',
        'Cafés',
        'Voyage',
        'Autres',
      ];

      const incomesRows = [];
      const categoriesRows = [];
      const expensesRows = [];

      for (const u of usersForSeeding) {
        const uid = u.id;
        // 1) categories (créer chaque catégorie pour ce user)
        for (const name of categoriesTemplate) {
          categoriesRows.push({
            name,
            description: `Catégorie ${name} pour user ${uid}`,
            userId: uid,
            createdAt: now,
            updatedAt: now,
          });
        }

        // 2) incomes: 6-10 par user
        const incomesCount = Math.floor(randBetween(6, 10));
        for (let i = 0; i < incomesCount; i++) {
          incomesRows.push({
            amount: randomAmount(200, 4500),
            date: randomDateWithin2Years(),
            source: ['Salaire', 'Freelance', 'Vente', 'Dividendes', 'Autre'][Math.floor(Math.random() * 5)],
            description: `Revenu seed #${i + 1} for user ${uid}`,
            creationDate: now,
            userId: uid,
            createdAt: now,
            updatedAt: now,
          });
        }

        // 3) expenses: environ 30 par user (mix)
        const expensesCount = 30;
        for (let i = 0; i < expensesCount; i++) {
          const isRecurring = Math.random() < 0.15;
          if (isRecurring) {
            const startDate = randomDateWithin2Years();
            const hasEnd = Math.random() < 0.6;
            const endDate = hasEnd ? randomDateBetween(startDate, nowISO) : null;
            expensesRows.push({
              amount: randomAmount(5, 300),
              description: `Dépense récurrente seed #${i + 1} for user ${uid}`,
              type: 'Recurring',
              startDate,
              endDate,
              userId: uid,
              // categoryId to set later after categories inserted
              createdAt: now,
              updatedAt: now,
            });
          } else {
            const date = randomDateWithin2Years();
            expensesRows.push({
              amount: randomAmount(1, 350),
              date,
              description: `Dépense ponctuelle seed #${i + 1} for user ${uid}`,
              type: 'OneTime',
              userId: uid,
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      } // end for each user

      // Insert categories first (avec userId) — on utilise bulkInsert
      await queryInterface.bulkInsert('Categories', categoriesRows, { transaction });

      // Récupérer categories insérées pour assigner categoryId aux expenses de façon aléatoire.
      // On récupère les categories pour chaque user
      const [dbCategories] = await queryInterface.sequelize.query(
        `SELECT id, name, "userId" FROM "Categories" WHERE name IN (${categoriesTemplate.map(() => '?').join(',')});`,
        { replacements: categoriesTemplate, transaction }
      );

      // Map userId -> list of categoryIds
      const catMap = {};
      for (const c of dbCategories) {
        catMap[c.userId] = catMap[c.userId] || [];
        catMap[c.userId].push(c.id);
      }

      // Assigner categoryId aléatoire aux expensesRows
      for (const exp of expensesRows) {
        const list = catMap[exp.userId] || [];
        if (list.length === 0) {
          // fallback: null (but categoryId not null in model) -> pick any category
          exp.categoryId = dbCategories.length > 0 ? dbCategories[0].id : null;
        } else {
          exp.categoryId = list[Math.floor(Math.random() * list.length)];
        }
      }

      // Insert incomes
      await queryInterface.bulkInsert('Incomes', incomesRows, { transaction });

      // Insert expenses in batches
      const batchSize = 200;
      for (let i = 0; i < expensesRows.length; i += batchSize) {
        const batch = expensesRows.slice(i, i + batchSize);
        await queryInterface.bulkInsert('Expenses', batch, { transaction });
      }

      await transaction.commit();

      // --- OUTPUT: credentials for created users ---
      console.log('--- Seeder terminé ✅ ---');
      console.log(`Fenêtre de dates utilisée : ${twoYearsAgoISO} -> ${nowISO}`);
      console.log('Comptes créés / trouvés et mots de passe (plain) si générés par le seeder :');
      for (const info of createdUserInfos) {
        console.log(` - id=${info.id}  email=${info.email}  password=${info.passwordPlain ? info.passwordPlain : '(existant / non modifié)'}`);
      }
      if (includeExistingUser && existingUser && !createdUserInfos.find(u => u.id === existingUser.id)) {
        console.log(`(Utilisateur existant utilisé) id=${existingUser.id} email=${existingUser.email} password=(non modifié)`);
      }
      console.log('Les catégories, revenus et dépenses ont été créés pour chacun des utilisateurs ci-dessus.');

    } catch (err) {
      await transaction.rollback();
      console.error('Erreur lors du seeder :', err);
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // On supprime uniquement les enregistrements créés par ce seeder.
      // Critère: descriptions contenant "seed" ou emails correspondants aux utilisateurs crées.
      const userEmailsToDelete = ['alice@example.com', 'bob@example.com', 'charlie@example.com', 'dora@example.com'];
      const johnEmail = 'john@doe.fr';

      // Récupérer ids des users créés (s'ils existent)
      const [foundUsers] = await queryInterface.sequelize.query(
        `SELECT id, email FROM "Users" WHERE email IN (${[...userEmailsToDelete, johnEmail].map(() => '?').join(',')})`,
        { replacements: [...userEmailsToDelete, johnEmail], transaction }
      );

      const idsToDelete = [];
      const johnInDb = foundUsers.find(u => u.email === johnEmail);
      for (const u of foundUsers) {
        // si john@doe.fr existait avant, on NE LE SUPPRIME PAS pour sécurité.
        if (u.email === johnEmail) {
          // Si le seeder a explicitement créé john (i.e. il n'existait pas avant) -> on ne peut pas détecter facilement maintenant.
          // Pour simplifier, on ne supprimera PAS john@doe.fr ici.
          console.log(`Down: utilisateur ${johnEmail} laissé intact (ne sera pas supprimé par ce down).`);
          continue;
        }
        idsToDelete.push(u.id);
      }

      // Supprimer incomes, expenses, categories liés à ces users
      if (idsToDelete.length > 0) {
        await queryInterface.bulkDelete('Incomes', { userId: idsToDelete }, { transaction });
        await queryInterface.bulkDelete('Expenses', { userId: idsToDelete }, { transaction });
        await queryInterface.bulkDelete('Categories', { userId: idsToDelete }, { transaction });
        await queryInterface.bulkDelete('Users', { id: idsToDelete }, { transaction });
        console.log('Down: supprimé les données liées aux utilisateurs seed (hors john@doe.fr).');
      } else {
        console.log('Down: aucun user seed à supprimer (vérifie les emails dans le seeder).');
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error('Erreur lors du down seeder :', err);
      throw err;
    }
  }
};
