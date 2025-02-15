import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Product } from './DataTable';

type IOwnProps = {
  open: boolean;
  editMode: boolean;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
  toggleProductModal: () => void;
};
const defaultProduct: Product = {
  name: '',
  category: '',
  price: '0',
  quantity: 0,
  value: '0',
};
export function ProductModal(props: IOwnProps) {
  const { open, product, toggleProductModal, editMode, onSave } = props;
  const [formData, setFormData] = useState(product || defaultProduct);

  useEffect(() => {
    setFormData(product || defaultProduct);
  }, [product, editMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toggleProductModal();
  };

  return (
    <Dialog open={open} onOpenChange={toggleProductModal}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {editMode ? 'Edit ' : 'View '}Product : ( {product?.name} )
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='category' className='text-right'>
                Category
              </Label>
              <Input
                id='category'
                value={formData.category || ''}
                className='col-span-3'
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>
                Price
              </Label>
              <Input
                id='price'
                value={formData.price || ''}
                className='col-span-3'
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='value' className='text-right'>
                Value
              </Label>
              <Input
                id='value'
                value={formData.value || ''}
                className='col-span-3'
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='quantity' className='text-right'>
                Quantity
              </Label>
              <Input
                id='quantity'
                value={formData.quantity || ''}
                className='col-span-3'
                onChange={handleInputChange}
                disabled={!editMode}
              />
            </div>
          </div>
          {editMode && (
            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
