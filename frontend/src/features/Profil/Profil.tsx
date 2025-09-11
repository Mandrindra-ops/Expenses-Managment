import React, { useEffect, useState } from 'react';
import ProfilContent from './ProfilContent';
import { ProfilService } from '../../services/profil.service';
import { SummaryService } from '../../services/summary.service';
import { Loader } from '../../components/ui/Loader';
export type ProfilData = {
    email: string;
    createdAt: string;
    balance: number;
}
const Profil: React.FC = () => {
    const [profil, setProfil] = useState<ProfilData | null>(null);

    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const { email, createdAt } = await ProfilService.getProfil();
                const { balance } = await SummaryService.getsummary();
                setProfil({
                    email,
                    createdAt,
                    balance: parseInt(balance.toString(), 10),
                });
            } catch (error) {
                console.error("Erreur lors du chargement du profil :", error);
            }
        };

        fetchProfil();
    }, []);
    if (!profil) {
        return <Loader />;
    }
    return <ProfilContent profil={profil} />;
};

export default Profil;
