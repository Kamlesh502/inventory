import { PageHeader, PageHeaderHeading } from '@/components/page-header';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DataTable, Product } from '@/pages/dashboard/components/DataTable';
import * as React from 'react';

export default function Dashboard() {
  const [data, setData] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<string>(
    localStorage.getItem('mode') || 'user'
  );

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const updateMode = () => {
      setMode(localStorage.getItem('mode') || 'user');
    };

    window.addEventListener('storage', updateMode);

    const observer = new MutationObserver(updateMode);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('storage', updateMode);
      observer.disconnect();
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://dev-0tf0hinghgjl39z.api.raw-labs.com/inventory'
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    const totalProducts = data.length;
    const totalStoreValue = data.reduce((sum, item) => {
      const priceValue = parseFloat(item.value?.replace(/[^0-9.]/g, '') || '0');
      return sum + priceValue;
    }, 0);
    const outOfStock = data.filter((item) => item.stock === 0).length;
    const noOfCategories = new Set(data.map((item) => item.category)).size;

    return [
      { label: 'Total Products', value: totalProducts },
      { label: 'Total Store Value', value: totalStoreValue.toLocaleString() },
      { label: 'Out of Stock', value: outOfStock },
      { label: 'No. of Categories', value: noOfCategories },
    ];
  }, [data]);

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Inventory Stats</PageHeaderHeading>
      </PageHeader>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-4'>
        {stats.map((stat, index) => (
          <Card
            key={index}
            className='bg-green-900 text-white p-6 flex flex-col items-start'
          >
            <CardTitle className='text-lg mb-2'>{stat.label}</CardTitle>
            <CardContent className='text-3xl font-bold'>
              {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>
      <DataTable data={data} loading={loading} mode={mode} setData={setData} />
    </>
  );
}
