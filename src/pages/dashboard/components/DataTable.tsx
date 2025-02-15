'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronDown,
  DeleteIcon,
  EditIcon,
  MoreHorizontal,
  ViewIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import { ProductModal } from './ProductModal';

export type Product = {
  category: string;
  name: string;
  price: string;
  quantity: number;
  value: string;
  stock?: number;
};

type IOwnProps = {
  data: Product[];
  loading: boolean;
  mode: string;
  setData: (data: Product[]) => void;
};

const DataTableLoading = () => (
  <div className='animate-pulse'>
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: 4 }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton className='h-4 w-full rounded' />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 3 }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: 4 }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className='h-4 w-full rounded' />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export function DataTable({ data, loading, mode, setData }: IOwnProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);

  const toggleProductModal = () => {
    setModalOpen(!modalOpen);
    setSelectedProduct(null);
  };

  const handleViewClick = (product: Product) => {
    setEditMode(false);
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditMode(true);
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const onDeleteProduct = (product: Product) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setData(data.filter((p) => p.name !== product.name));
    }
  };

  const onEditProduct = (updatedProduct: Product) => {
    const updatedData = data.map((product) =>
      product.name === updatedProduct.name ? updatedProduct : product
    );
    setData(updatedData);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <div className='lowercase'>{row.getValue('category')}</div>
      ),
    },
    {
      accessorKey: 'price',
      header: () => <div className='text-right'>Price</div>,
      cell: ({ row }) => (
        <div className='text-right font-medium'>{row.getValue('price')}</div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: () => <div className='text-right'>Quantity</div>,
      cell: ({ row }) => (
        <div className='text-right font-medium'>{row.getValue('quantity')}</div>
      ),
    },
    {
      accessorKey: 'value',
      header: () => <div className='text-right'>Value</div>,
      cell: ({ row }) => (
        <div className='text-right font-medium'>{row.getValue('value')}</div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => handleViewClick(product)}
                disabled={mode === 'user'}
              >
                <ViewIcon className='mr-3' /> View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditClick(product)}
                disabled={mode === 'user'}
              >
                <EditIcon className='mr-3' /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteProduct(product)}
                disabled={mode === 'user'}
              >
                <DeleteIcon className='mr-3' /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className='w-full'>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter by name...'
          value={(table.getColumn('name')?.getFilterValue() as string) || ''}
          onChange={(e) =>
            table.getColumn('name')?.setFilterValue(e.target.value)
          }
          className='max-w-sm'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        {loading ? (
          <DataTableLoading />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <ProductModal
        open={modalOpen}
        product={selectedProduct}
        toggleProductModal={toggleProductModal}
        editMode={editMode}
        onSave={onEditProduct}
      />
    </div>
  );
}
