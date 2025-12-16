import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import TipoCertificadoForm from '@/components/TipoCertificadoForm';
import { 
  getTiposCertificado, 
  addTipoCertificado, 
  updateTipoCertificado, 
  deleteTipoCertificado
} from '@/lib/storage';
import { TipoCertificadoBase } from '@/types';
import { toast } from 'sonner';
import { 
  FilePlus, 
  Search, 
  Edit, 
  Trash2,
  FileText
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Certificados() {
  const [tiposCertificado, setTiposCertificado] = useState<TipoCertificadoBase[]>([]);
  const [filteredTipos, setFilteredTipos] = useState<TipoCertificadoBase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoCertificadoBase | null>(null);
  const [tipoToDelete, setTipoToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadTipos();
  }, []);

  useEffect(() => {
    filterTipos();
  }, [tiposCertificado, searchTerm]);

  const loadTipos = () => {
    const data = getTiposCertificado();
    setTiposCertificado(data);
  };

  const filterTipos = () => {
    let filtered = [...tiposCertificado];

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.observacoes && t.observacoes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTipos(filtered);
  };

  const handleSave = (data: Partial<TipoCertificadoBase>) => {
    try {
      if (selectedTipo) {
        updateTipoCertificado(selectedTipo.id, data);
        toast.success('Tipo de certificado atualizado com sucesso!');
      } else {
        addTipoCertificado(data as Omit<TipoCertificadoBase, 'id' | 'createdAt' | 'updatedAt'>);
        toast.success('Tipo de certificado cadastrado com sucesso!');
      }
      loadTipos();
      setSelectedTipo(null);
    } catch (error) {
      toast.error('Erro ao salvar tipo de certificado');
    }
  };

  const handleDelete = () => {
    if (tipoToDelete) {
      try {
        deleteTipoCertificado(tipoToDelete);
        toast.success('Tipo de certificado excluído com sucesso!');
        loadTipos();
      } catch (error) {
        toast.error('Erro ao excluir tipo de certificado');
      }
      setTipoToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Certificados</h2>
          <p className="text-gray-500 mt-1">Gerencie os tipos de certificados disponíveis</p>
        </div>
        <Button
          onClick={() => {
            setSelectedTipo(null);
            setFormOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          Novo Certificado
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por tipo ou observações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredTipos.length} de {tiposCertificado.length} certificados
      </div>

      {/* Tipos List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTipos.map((tipo) => (
          <Card key={tipo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <Badge variant="outline" className="mb-2">
                    <FileText className="w-3 h-3 mr-1" />
                    Tipo
                  </Badge>
                  <CardTitle className="text-lg">{tipo.tipo}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {tipo.observacoes && (
                <div className="text-sm text-gray-600">
                  <p className="line-clamp-3">{tipo.observacoes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedTipo(tipo);
                    setFormOpen(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTipoToDelete(tipo.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTipos.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FilePlus className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600">Nenhum tipo de certificado encontrado</p>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm
                ? 'Tente ajustar os filtros de busca'
                : 'Comece cadastrando um novo tipo de certificado'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <TipoCertificadoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        tipoCertificado={selectedTipo}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!tipoToDelete} onOpenChange={() => setTipoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este tipo de certificado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}