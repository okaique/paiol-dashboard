
import type { StatusPaiol } from '@/types/database';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'VAZIO':
      return 'bg-gray-500';
    case 'DRAGANDO':
      return 'bg-blue-500';
    case 'CHEIO':
      return 'bg-green-500';
    case 'RETIRANDO':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'VAZIO': 'Vazio',
    'DRAGANDO': 'Dragando',
    'CHEIO': 'Cheio',
    'RETIRANDO': 'Retirando',
  };
  return labels[status] || status;
};
