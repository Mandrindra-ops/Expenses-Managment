import React, { useState } from 'react';

const ProfilContent: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const userData = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    memberSince: '15 Mars 2023',
    currency: 'EUR - Euro',
    language: 'Français',
    balance: 1250, // Exemple balance restante
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête avec bannière */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-6">
            {/* Avatar circulaire */}
            <div className="w-32 h-32 rounded-full bg-[var(--color-bg-card)] flex items-center justify-center shadow-lg ring-4 ring-white/20">
              <span className="text-4xl font-bold text-[var(--color-primary)]">MD</span>
            </div>

            {/* Infos principales */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
              <p className="text-white/80">{userData.email}</p>
              <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-3">
                <span className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                  Membre depuis {userData.memberSince}
                </span>
                <span className="px-3 py-1 bg-green-500/20 text-green-200 text-sm rounded-full">
                  ✅ Actif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carte infos perso */}
          <div className="bg-[var(--color-bg-card)] rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              Informations personnelles
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-sub)]">Langue</label>
                <p className="font-medium text-[var(--color-text)]">{userData.language}</p>
              </div>
              <div>
                <label className="block text-sm text-[var(--color-text-sub)]">Devise</label>
                <p className="font-medium text-[var(--color-text)]">{userData.currency}</p>
              </div>
            </div>
          </div>

          {/* Carte Balance restante */}
          <div className="bg-[var(--color-bg-card)] rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Balance restante</h3>
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-sm text-[var(--color-text-sub)]">Montant disponible</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">
                {userData.balance.toLocaleString()} €
              </p>
            </div>
          </div>
        </div>

        {/* Carte Sécurité */}
        <div className="bg-[var(--color-bg-card)] rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Sécurité</h3>
          <p className="text-[var(--color-text-sub)] mb-4">
            Pour protéger votre compte, changez régulièrement votre mot de passe.
          </p>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow hover:opacity-90 transition"
            >
              🔒 Changer de mot de passe
            </button>
          ) : (
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow hover:opacity-90 transition"
                >
                   Mettre à jour
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-400 text-white font-medium shadow hover:opacity-90 transition"
                >
                   Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilContent;
