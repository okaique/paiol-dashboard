
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para obter a data atual no fuso de Brasília
export const getNowBrasilia = (): Date => {
  return new Date();
};

// Função para formatar data garantindo que seja exibida no fuso de Brasília
export const formatarDataHoraBrasilia = (data: string | Date): string => {
  try {
    console.log('=== FORMATANDO DATA BRASÍLIA ===');
    console.log('Data original:', data);
    
    let dataObj: Date;
    
    if (typeof data === 'string') {
      dataObj = parseISO(data);
    } else {
      dataObj = data;
    }
    
    console.log('Data objeto:', dataObj);
    console.log('Data válida?', !isNaN(dataObj.getTime()));
    
    if (isNaN(dataObj.getTime())) {
      console.error('Data inválida detectada:', data);
      return String(data);
    }
    
    // Garantir que a formatação seja no fuso de Brasília
    const dataFormatada = format(dataObj, "dd/MM/yyyy 'às' HH:mm", { 
      locale: ptBR 
    });
    
    console.log('Data formatada (Brasília):', dataFormatada);
    return dataFormatada;
  } catch (error) {
    console.error('Erro ao formatar data:', { data, error });
    return String(data);
  }
};

// Função para converter data para ISO string mantendo o horário atual
export const toISOStringBrasilia = (data: Date | string | null): string => {
  if (data === null) {
    return new Date().toISOString();
  }
  
  let dataObj: Date;
  if (typeof data === 'string') {
    // Se a string for uma data como YYYY-MM-DD, adicionar horário atual
    if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const hoje = new Date();
      dataObj = new Date(`${data}T${hoje.getHours().toString().padStart(2, '0')}:${hoje.getMinutes().toString().padStart(2, '0')}:${hoje.getSeconds().toString().padStart(2, '0')}`);
    } else {
      dataObj = parseISO(data);
    }
  } else {
    dataObj = data;
  }
  
  return dataObj.toISOString();
};

// Função para criar uma nova data no fuso de Brasília
export const createDateBrasilia = (
  year?: number, 
  month?: number, 
  day?: number, 
  hour?: number, 
  minute?: number, 
  second?: number
): Date => {
  const now = new Date();
  
  return new Date(
    year ?? now.getFullYear(),
    month ?? now.getMonth(),
    day ?? now.getDate(),
    hour ?? now.getHours(),
    minute ?? now.getMinutes(),
    second ?? now.getSeconds()
  );
};
