
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, FilterX, Search, Calendar } from 'lucide-react';
import { FilterOptions } from '@/hooks/useListFilters';

interface ListFiltersProps {
  filters: FilterOptions;
  showFilters: boolean;
  hasActiveFilters: boolean;
  onToggleFilters: () => void;
  onUpdateFilter: (key: keyof FilterOptions, value: string) => void;
  onClearFilters: () => void;
  onQuickDateFilter: (days: number) => void;
  statusOptions?: { value: string; label: string }[];
  categoriaOptions?: { value: string; label: string }[];
  showStatus?: boolean;
  showCategoria?: boolean;
  showDateFilters?: boolean;
  searchPlaceholder?: string;
}

export const ListFilters = ({
  filters,
  showFilters,
  hasActiveFilters,
  onToggleFilters,
  onUpdateFilter,
  onClearFilters,
  onQuickDateFilter,
  statusOptions = [],
  categoriaOptions = [],
  showStatus = false,
  showCategoria = false,
  showDateFilters = false,
  searchPlaceholder = "Buscar...",
}: ListFiltersProps) => {
  // Filtrar opções com valores válidos
  const validStatusOptions = statusOptions.filter(option => 
    option.value && 
    typeof option.value === 'string' && 
    option.value.trim() !== ''
  );

  const validCategoriaOptions = categoriaOptions.filter(option => 
    option.value && 
    typeof option.value === 'string' && 
    option.value.trim() !== ''
  );

  return (
    <div className="space-y-4">
      {/* Barra de busca sempre visível */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilter('searchTerm', e.target.value)}
            className="pl-8"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              !
            </Badge>
          )}
        </Button>
      </div>

      {/* Filtros expandidos */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtros de Data */}
            {showDateFilters && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Data Início</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => onUpdateFilter('dateFrom', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateTo">Data Fim</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => onUpdateFilter('dateTo', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Filtro de Status */}
            {showStatus && validStatusOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filters.status || "TODOS"} onValueChange={(value) => onUpdateFilter('status', value === "TODOS" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODOS">Todos os status</SelectItem>
                    {validStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtro de Categoria */}
            {showCategoria && validCategoriaOptions.length > 0 && (
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={filters.categoria || "TODAS"} onValueChange={(value) => onUpdateFilter('categoria', value === "TODAS" ? "" : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODAS">Todas as categorias</SelectItem>
                    {validCategoriaOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Filtros rápidos de data */}
          {showDateFilters && (
            <div className="space-y-2">
              <Label>Filtros Rápidos</Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickDateFilter(0)}
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-3 w-3" />
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickDateFilter(7)}
                >
                  7 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickDateFilter(30)}
                >
                  30 dias
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuickDateFilter(90)}
                >
                  90 dias
                </Button>
              </div>
            </div>
          )}

          {/* Limpar filtros */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <FilterX className="h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
