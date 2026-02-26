import React, { useState, useMemo } from "react";
import { entities, integrations } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/admin/PageHeader";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { useCrudModal } from "@/hooks/useCrudModal";
import { PRODUTO_INICIAL, CATEGORIA_PRODUTO_INICIAL } from "@/constants/produtos";
import ProdutoList from "./produtos/ProdutoList";
import ProdutoModal from "./produtos/ProdutoModal";
import CategoriaProdutoList from "./produtos/CategoriaProdutoList";
import CategoriaProdutoModal from "./produtos/CategoriaProdutoModal";

export default function Produtos() {
  const queryClient = useQueryClient();
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [produtoExcluir, setProdutoExcluir] = useState(null);
  const [categoriaExcluir, setCategoriaExcluir] = useState(null);

  const produtoCrud = useCrudModal(PRODUTO_INICIAL);
  const categoriaCrud = useCrudModal(CATEGORIA_PRODUTO_INICIAL);

  const { data: produtos = [], isLoading: loadingProdutos } = useQuery({
    queryKey: ["produtos"],
    queryFn: () => entities.Produto.list("ordem"),
  });

  const { data: categoriasProduto = [], isLoading: loadingCategorias } = useQuery({
    queryKey: ["categoriasProduto"],
    queryFn: () => entities.CategoriaProduto.list("ordem"),
  });

  const produtosFiltrados = useMemo(() => {
    if (filtroCategoria === "todos") return produtos;
    return produtos.filter(
      (p) =>
        p.categoria_id === filtroCategoria || (p.categoria && p.categoria === filtroCategoria)
    );
  }, [produtos, filtroCategoria]);

  const createProdutoMutation = useMutation({
    mutationFn: (data) => entities.Produto.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["produtos"]);
      produtoCrud.close();
    },
  });

  const updateProdutoMutation = useMutation({
    mutationFn: ({ id, data }) => entities.Produto.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["produtos"]);
      produtoCrud.close();
    },
  });

  const deleteProdutoMutation = useMutation({
    mutationFn: (id) => entities.Produto.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["produtos"]);
      setProdutoExcluir(null);
    },
  });

  const createCategoriaMutation = useMutation({
    mutationFn: (data) => entities.CategoriaProduto.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categoriasProduto"]);
      categoriaCrud.close();
    },
  });

  const updateCategoriaMutation = useMutation({
    mutationFn: ({ id, data }) => entities.CategoriaProduto.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categoriasProduto"]);
      categoriaCrud.close();
    },
  });

  const deleteCategoriaMutation = useMutation({
    mutationFn: (id) => entities.CategoriaProduto.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categoriasProduto"]);
      setCategoriaExcluir(null);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const abrirNovoProduto = () => produtoCrud.openNew({ ordem: produtos.length });
  const abrirEdicaoProduto = (produto) =>
    produtoCrud.openEdit(produto, (p) => ({
      nome: p.nome || "",
      codigo: p.codigo || "",
      categoria_id: p.categoria_id || (p.categoria ? "" : ""),
      descricao: p.descricao || "",
      preco: p.preco || 0,
      imagem_url: p.imagem_url || "",
      unidade: p.unidade || "unidade",
      estoque: p.estoque !== false,
      estoque_quantidade: p.estoque_quantidade || 0,
      ativo: p.ativo !== false,
      ordem: p.ordem || 0,
    }));

  const abrirNovaCategoria = () =>
    categoriaCrud.openNew({ ordem: categoriasProduto.length });
  const abrirEdicaoCategoria = (categoria) =>
    categoriaCrud.openEdit(categoria, (c) => ({
      nome: c.nome || "",
      descricao: c.descricao || "",
      ordem: c.ordem || 0,
      ativo: c.ativo !== false,
    }));

  const salvarProduto = () => {
    if (produtoCrud.editingItem) {
      updateProdutoMutation.mutate({
        id: produtoCrud.editingItem.id,
        data: produtoCrud.formState,
      });
    } else {
      createProdutoMutation.mutate(produtoCrud.formState);
    }
  };

  const salvarCategoria = () => {
    if (categoriaCrud.editingItem) {
      updateCategoriaMutation.mutate({
        id: categoriaCrud.editingItem.id,
        data: categoriaCrud.formState,
      });
    } else {
      createCategoriaMutation.mutate(categoriaCrud.formState);
    }
  };

  const handleProdutoImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await integrations.Core.UploadFile({ file });
    produtoCrud.setFormState((p) => ({ ...p, imagem_url: file_url }));
  };

  return (
    <div className="w-full">
      <PageHeader
        title="Produtos Comerciais"
        description="Gerencie produtos comercializáveis (acessórios e outros)"
      />

      <Tabs defaultValue="produtos" className="w-full">
        <TabsList className="bg-slate-100 rounded-xl p-1 h-auto">
          <TabsTrigger value="produtos" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-4 text-sm">Produtos</TabsTrigger>
          <TabsTrigger value="categorias" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-2 px-4 text-sm">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="produtos">
          <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Produtos</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Itens que podem ser adicionados ao orçamento e carrinho
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger className="w-40 h-9 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {categoriasProduto.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={abrirNovoProduto} className="bg-blue-600 hover:bg-blue-700 rounded-xl h-9 text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProdutoList
                produtosFiltrados={produtosFiltrados}
                categoriasProduto={categoriasProduto}
                isLoading={loadingProdutos}
                onEdit={abrirEdicaoProduto}
                onDelete={setProdutoExcluir}
              />
            </CardContent>
          </Card>

          <ProdutoModal
            open={produtoCrud.modalOpen}
            onOpenChange={produtoCrud.setModalOpen}
            formState={produtoCrud.formState}
            setFormState={produtoCrud.setFormState}
            isEdit={!!produtoCrud.editingItem}
            categoriasProduto={categoriasProduto}
            onSave={salvarProduto}
            isPending={createProdutoMutation.isPending || updateProdutoMutation.isPending}
            onImageUpload={handleProdutoImageUpload}
          />

          <DeleteConfirmDialog
            open={!!produtoExcluir}
            onOpenChange={() => setProdutoExcluir(null)}
            title="Excluir produto?"
            itemName={produtoExcluir?.nome}
            onConfirm={() => deleteProdutoMutation.mutate(produtoExcluir?.id)}
            isPending={deleteProdutoMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="categorias">
          <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">Categorias de Produtos</CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Gerencie as categorias dos produtos comercializáveis
                </CardDescription>
              </div>
              <Button onClick={abrirNovaCategoria} className="bg-blue-600 hover:bg-blue-700 rounded-xl h-9 text-sm shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </CardHeader>
            <CardContent>
              <CategoriaProdutoList
                categorias={categoriasProduto}
                isLoading={loadingCategorias}
                onEdit={abrirEdicaoCategoria}
                onDelete={setCategoriaExcluir}
              />
            </CardContent>
          </Card>

          <CategoriaProdutoModal
            open={categoriaCrud.modalOpen}
            onOpenChange={categoriaCrud.setModalOpen}
            formState={categoriaCrud.formState}
            setFormState={categoriaCrud.setFormState}
            isEdit={!!categoriaCrud.editingItem}
            onSave={salvarCategoria}
            isPending={createCategoriaMutation.isPending || updateCategoriaMutation.isPending}
          />

          <DeleteConfirmDialog
            open={!!categoriaExcluir}
            onOpenChange={() => setCategoriaExcluir(null)}
            title="Excluir categoria?"
            itemName={categoriaExcluir?.nome}
            onConfirm={() => deleteCategoriaMutation.mutate(categoriaExcluir?.id)}
            isPending={deleteCategoriaMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
