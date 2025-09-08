import React from 'react';

const ProfilContent: React.FC = () => {
    const userData = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    memberSince: '15 Mars 2023',
    currency: 'EUR - Euro',
    language: 'Français',
    monthlyBudget: 1850,
    };

    return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo de profil */}
            <div className="lg:col-span-1">
            <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
                <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl text-white font-bold">MD</span>
                </div>
                <h2 className="text-xl font-semibold text-[var(--color-text)] text-center">{userData.name}</h2>
                <p className="text-[var(--color-text-sub)] text-center">{userData.email}</p>
                
                <div className="w-full mt-6 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-[var(--color-text-sub)]">Membre depuis</span>
                        <span className="text-[var(--color-text)] font-medium">{userData.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[var(--color-text-sub)]">Statut</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Actif</span>
                    </div>
                </div>
                </div>
            </div>
            </div>

          {/* Informations personnelles */}
            <div className="lg:col-span-2">
            <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Informations personnelles</h3>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Nom complet</label>
                    <p className="text-[var(--color-text)] p-2 bg-[var(--color-bg)] rounded-lg">{userData.name}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Email</label>
                    <p className="text-[var(--color-text)] p-2 bg-[var(--color-bg)] rounded-lg">{userData.email}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Téléphone</label>
                    <p className="text-[var(--color-text)] p-2 bg-[var(--color-bg)] rounded-lg">{userData.phone}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Budget mensuel</label>
                    <p className="text-[var(--color-text)] p-2 bg-[var(--color-bg)] rounded-lg">{userData.monthlyBudget} €</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Devise</label>
                    <p className="text-[var(--color-text)] p-2 bg-[var(--color-bg)] rounded-lg">{userData.currency}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Langue</label>
                    <p className="text-[var(--color-text)] p-2 bg-[var(--color-bg)] rounded-lg">{userData.language}</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    );
};

export default ProfilContent;