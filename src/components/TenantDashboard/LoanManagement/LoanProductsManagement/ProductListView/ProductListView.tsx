// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/ProductListView/ProductListView.tsx

import React, { useState, useEffect } from 'react';
import { loanService } from '../../../../../services/api/tenant/loanService';
import { type LoanProduct } from '../../../../../types/loanTypes';
import { toast } from 'react-toastify';


interface ProductListViewProps {
  onEditProduct: (product: LoanProduct) => void;
}

const ProductListView: React.FC<ProductListViewProps> = ({ onEditProduct }) => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await loanService.getLoanProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load loan products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await loanService.deleteLoanProduct(productId);
      toast.success('Product deleted successfully');
      loadProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspended' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      personal: '👤',
      business: '🏢',
      agricultural: '🌾',
      mortgage: '🏠',
      auto: '🚗',
      payslip: '💼',
      microfinance: '👥'
    };
    return icons[category] || '📊';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || product.status === statusFilter;
    const matchesCategory = !categoryFilter || product.productCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="product-list-view">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search products by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="suspended">Suspended</option>
              <option value="archived">Archived</option>
            </select>
            
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="agricultural">Agricultural</option>
              <option value="mortgage">Mortgage</option>
              <option value="auto">Auto</option>
              <option value="payslip">Salary Advance</option>
              <option value="microfinance">Microfinance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-500 text-lg mb-2">
            {searchTerm || statusFilter || categoryFilter 
              ? 'No products match your search criteria' 
              : 'No loan products found'
            }
          </div>
          <p className="text-gray-400 mb-4">
            {searchTerm || statusFilter || categoryFilter 
              ? 'Try adjusting your search terms or filters' 
              : 'Create your first loan product to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Product Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl mt-1">
                    {getCategoryIcon(product.productCategory)}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.code}</p>
                  </div>
                </div>
                {getStatusBadge(product.status)}
              </div>

              {/* Product Description */}
              {product.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Product Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {product.productCategory?.replace('_', ' ') || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Interest Rate:</span>
                  <span className="text-gray-900 font-medium">
                    {product.configuration?.interestConfig?.baseRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Loan Amount:</span>
                  <span className="text-gray-900 font-medium">
                    {product.configuration?.amountConfig?.type === 'range'
                      ? `${(product.configuration.amountConfig.minAmount || 0).toLocaleString()} - ${(product.configuration.amountConfig.maxAmount || 0).toLocaleString()}`
                      : `${(product.configuration?.amountConfig?.fixedAmount || 0).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Term:</span>
                  <span className="text-gray-900 font-medium">
                    {product.configuration?.termConfig?.minTerm || 0}-{product.configuration?.termConfig?.maxTerm || 0} {product.configuration?.termConfig?.termUnit || 'months'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEditProduct(product)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                >
                  Edit
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // View details action - you can implement this later
                      console.log('View product:', product._id);
                    }}
                    className="text-gray-600 hover:text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-50 transition-colors"
                  >
                    View
                  </button>
                  
                  {product.status !== 'active' && (
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {products.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-gray-500">Total Products</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-500">Draft</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.status === 'suspended').length}
            </div>
            <div className="text-sm text-gray-500">Suspended</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListView;