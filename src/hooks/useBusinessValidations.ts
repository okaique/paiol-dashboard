import { useClientes } from './useClientes';
import { useDragadores } from './useDragadores';
import { useAjudantes } from './useAjudantes';
import { useCaminhoes } from './useCaminhoes';
import { useTiposInsumos } from './useTiposInsumos';
import { usePaiols } from './usePaiols';
import { useRetiradas } from './useRetiradas';
import { useDragagemAtiva } from './useDragagens';
import { useCubagens } from './useCubagens';
import type { StatusPaiol } from '@/types/database';

export interface ValidationError {
  field?: string;
  message: string;
  type: 'warning' | 'error';
}

export const useBusinessValidations = () => {
  const { data: clientes = [] } = useClientes();
  const { data: dragadores = [] } = useDragadores();
  const { data: ajudantes = [] } = useAjudantes();
  const { data: caminhoes = [] } = useCaminhoes();
  const { data: tiposInsumos = [] } = useTiposInsumos();
  const { data: paiols = [] } = usePaiols();

  // Validações para Cliente
  const validateCliente = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.nome?.trim()) {
      errors.push({ field: 'nome', message: 'Nome é obrigatório', type: 'error' });
    } else if (data.nome.length < 2) {
      errors.push({ field: 'nome', message: 'Nome deve ter pelo menos 2 caracteres', type: 'error' });
    }

    // Verificar duplicação de nome
    const nomeExistente = clientes.find(c => 
      c.nome.toLowerCase() === data.nome?.toLowerCase() && c.id !== data.id
    );
    if (nomeExistente) {
      errors.push({ field: 'nome', message: 'Já existe um cliente com este nome', type: 'error' });
    }

    // Validação de CPF/CNPJ
    if (data.cpf_cnpj) {
      const cpfCnpjLimpo = data.cpf_cnpj.replace(/\D/g, '');
      if (data.tipo_pessoa === 'FISICA') {
        if (cpfCnpjLimpo.length !== 11) {
          errors.push({ field: 'cpf_cnpj', message: 'CPF deve conter 11 dígitos', type: 'error' });
        }
      } else if (data.tipo_pessoa === 'JURIDICA') {
        if (cpfCnpjLimpo.length !== 14) {
          errors.push({ field: 'cpf_cnpj', message: 'CNPJ deve conter 14 dígitos', type: 'error' });
        }
      }

      // Verificar duplicação de CPF/CNPJ
      const docExistente = clientes.find(c => 
        c.cpf_cnpj === data.cpf_cnpj && c.id !== data.id
      );
      if (docExistente) {
        errors.push({ field: 'cpf_cnpj', message: 'CPF/CNPJ já cadastrado', type: 'error' });
      }
    }

    // Validação de email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: 'Email inválido', type: 'error' });
    }

    // Validação de telefone
    if (data.telefone && data.telefone.replace(/\D/g, '').length < 10) {
      errors.push({ field: 'telefone', message: 'Telefone deve ter pelo menos 10 dígitos', type: 'warning' });
    }

    return errors;
  };

  // Validações para Paiol
  const validatePaiol = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.nome?.trim()) {
      errors.push({ field: 'nome', message: 'Nome do paiol é obrigatório', type: 'error' });
    }

    if (!data.localizacao) {
      errors.push({ field: 'localizacao', message: 'Localização é obrigatória', type: 'error' });
    }

    // Verificar duplicação de nome
    const nomeExistente = paiols.find(p => 
      p.nome.toLowerCase() === data.nome?.toLowerCase() && p.id !== data.id
    );
    if (nomeExistente) {
      errors.push({ field: 'nome', message: 'Já existe um paiol com este nome', type: 'error' });
    }

    return errors;
  };

  // Validações para Dragador/Ajudante
  const validatePessoa = (data: any, tipo: 'dragador' | 'ajudante'): ValidationError[] => {
    const errors: ValidationError[] = [];
    const pessoas = tipo === 'dragador' ? dragadores : ajudantes;

    if (!data.nome?.trim()) {
      errors.push({ field: 'nome', message: 'Nome é obrigatório', type: 'error' });
    } else if (data.nome.length < 2) {
      errors.push({ field: 'nome', message: 'Nome deve ter pelo menos 2 caracteres', type: 'error' });
    }

    // Verificar duplicação de nome
    const nomeExistente = pessoas.find(p => 
      p.nome.toLowerCase() === data.nome?.toLowerCase() && p.id !== data.id
    );
    if (nomeExistente) {
      errors.push({ field: 'nome', message: `Já existe um ${tipo} com este nome`, type: 'error' });
    }

    // Validação de CPF
    if (data.cpf) {
      const cpfLimpo = data.cpf.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        errors.push({ field: 'cpf', message: 'CPF deve conter 11 dígitos', type: 'error' });
      }

      // Verificar duplicação de CPF
      const cpfExistente = pessoas.find(p => 
        p.cpf === data.cpf && p.id !== data.id
      );
      if (cpfExistente) {
        errors.push({ field: 'cpf', message: 'CPF já cadastrado', type: 'error' });
      }
    }

    // Validação de valor da diária
    if (data.valor_diaria && data.valor_diaria <= 0) {
      errors.push({ field: 'valor_diaria', message: 'Valor da diária deve ser maior que zero', type: 'error' });
    }

    return errors;
  };

  // Validações para Caminhão
  const validateCaminhao = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.placa?.trim()) {
      errors.push({ field: 'placa', message: 'Placa é obrigatória', type: 'error' });
    } else {
      // Validação básica de formato de placa
      const placaLimpa = data.placa.replace(/[^A-Za-z0-9]/g, '');
      if (placaLimpa.length < 7) {
        errors.push({ field: 'placa', message: 'Placa deve ter formato válido', type: 'error' });
      }

      // Verificar duplicação de placa
      const placaExistente = caminhoes.find(c => 
        c.placa.replace(/[^A-Za-z0-9]/g, '') === placaLimpa && c.id !== data.id
      );
      if (placaExistente) {
        errors.push({ field: 'placa', message: 'Placa já cadastrada', type: 'error' });
      }
    }

    // Validações opcionais
    if (data.ano && (data.ano < 1900 || data.ano > new Date().getFullYear() + 1)) {
      errors.push({ field: 'ano', message: 'Ano inválido', type: 'error' });
    }

    if (data.capacidade_m3 && data.capacidade_m3 <= 0) {
      errors.push({ field: 'capacidade_m3', message: 'Capacidade deve ser maior que zero', type: 'error' });
    }

    return errors;
  };

  // Validações para Tipo de Insumo
  const validateTipoInsumo = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.nome?.trim()) {
      errors.push({ field: 'nome', message: 'Nome é obrigatório', type: 'error' });
    }

    if (!data.categoria) {
      errors.push({ field: 'categoria', message: 'Categoria é obrigatória', type: 'error' });
    }

    if (!data.unidade_medida) {
      errors.push({ field: 'unidade_medida', message: 'Unidade de medida é obrigatória', type: 'error' });
    }

    // Verificar duplicação de nome na mesma categoria
    const nomeExistente = tiposInsumos.find(t => 
      t.nome.toLowerCase() === data.nome?.toLowerCase() && 
      t.categoria === data.categoria && 
      t.id !== data.id
    );
    if (nomeExistente) {
      errors.push({ field: 'nome', message: 'Já existe um insumo com este nome na categoria selecionada', type: 'error' });
    }

    return errors;
  };

  // Validações para Transição de Status
  const validateStatusTransition = (paiolId: string, newStatus: StatusPaiol, dragadorId?: string, ajudanteId?: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    const paiol = paiols.find(p => p.id === paiolId);

    if (!paiol) {
      errors.push({ message: 'Paiol não encontrado', type: 'error' });
      return errors;
    }

    const currentStatus = paiol.status as StatusPaiol;

    // Validar transições permitidas
    const validTransitions: Record<StatusPaiol, StatusPaiol[]> = {
      'VAZIO': ['DRAGANDO'],
      'DRAGANDO': ['CHEIO'],
      'CHEIO': ['RETIRANDO'],
      'RETIRANDO': ['VAZIO']
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      errors.push({ 
        message: `Transição de ${currentStatus} para ${newStatus} não é permitida`, 
        type: 'error' 
      });
    }

    // Validações específicas por transição
    if (currentStatus === 'VAZIO' && newStatus === 'DRAGANDO') {
      if (!dragadorId) {
        errors.push({ field: 'dragador_id', message: 'Dragador é obrigatório para iniciar dragagem', type: 'error' });
      }
    }

    return errors;
  };

  // Validações para Retirada
  const validateRetirada = (paiolId: string, data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.cliente_id) {
      errors.push({ field: 'cliente_id', message: 'Cliente é obrigatório', type: 'error' });
    }

    if (!data.volume_retirado || data.volume_retirado <= 0) {
      errors.push({ field: 'volume_retirado', message: 'Volume deve ser maior que zero', type: 'error' });
    }

    if (data.valor_unitario && data.valor_unitario < 0) {
      errors.push({ field: 'valor_unitario', message: 'Valor unitário não pode ser negativo', type: 'error' });
    }

    if (data.tem_frete) {
      if (!data.valor_frete || data.valor_frete <= 0) {
        errors.push({ field: 'valor_frete', message: 'Valor do frete é obrigatório quando há frete', type: 'error' });
      }
      if (!data.caminhao_frete_id) {
        errors.push({ field: 'caminhao_frete_id', message: 'Caminhão do frete é obrigatório', type: 'error' });
      }
    }

    return errors;
  };

  // Validações para Gasto de Insumo
  const validateGastoInsumo = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.tipo_insumo_id) {
      errors.push({ field: 'tipo_insumo_id', message: 'Tipo de insumo é obrigatório', type: 'error' });
    }

    if (!data.quantidade || data.quantidade <= 0) {
      errors.push({ field: 'quantidade', message: 'Quantidade deve ser maior que zero', type: 'error' });
    }

    if (!data.valor_unitario || data.valor_unitario <= 0) {
      errors.push({ field: 'valor_unitario', message: 'Valor unitário deve ser maior que zero', type: 'error' });
    }

    if (data.data_gasto && new Date(data.data_gasto) > new Date()) {
      errors.push({ field: 'data_gasto', message: 'Data do gasto não pode ser futura', type: 'error' });
    }

    return errors;
  };

  // Validações para Cubagem
  const validateCubagem = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.medida_inferior || data.medida_inferior <= 0) {
      errors.push({ field: 'medida_inferior', message: 'Medida inferior deve ser maior que zero', type: 'error' });
    }

    if (!data.medida_superior || data.medida_superior <= 0) {
      errors.push({ field: 'medida_superior', message: 'Medida superior deve ser maior que zero', type: 'error' });
    }

    if (!data.perimetro || data.perimetro <= 0) {
      errors.push({ field: 'perimetro', message: 'Perímetro deve ser maior que zero', type: 'error' });
    }

    if (data.medida_inferior && data.medida_superior && data.medida_inferior > data.medida_superior) {
      errors.push({ 
        field: 'medida_superior', 
        message: 'Medida superior deve ser maior ou igual à medida inferior', 
        type: 'warning' 
      });
    }

    return errors;
  };

  // Validações para Tipo de Gasto
  const validateTipoGasto = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!data.nome?.trim()) {
      errors.push({ field: 'nome', message: 'Nome é obrigatório', type: 'error' });
    } else if (data.nome.length < 2) {
      errors.push({ field: 'nome', message: 'Nome deve ter pelo menos 2 caracteres', type: 'error' });
    }

    return errors;
  };

  return {
    validateCliente,
    validatePaiol,
    validatePessoa,
    validateCaminhao,
    validateTipoInsumo,
    validateStatusTransition,
    validateRetirada,
    validateGastoInsumo,
    validateCubagem,
    validateTipoGasto,
  };
};
