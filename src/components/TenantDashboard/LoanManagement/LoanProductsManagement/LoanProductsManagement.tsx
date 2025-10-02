// fe/src/components/TenantDashboard/LoanManagement/LoanProductsManagement/LoanProductsManagement.tsx

import React, { useState } from 'react';
import TemplateSelection from './TemplateSelection/TemplateSelection';
import ProductCreationWizard from './ProductCreationWizard/ProductCreationWizard';
import ProductListView from './ProductListView/ProductListView';
import { type LoanProduct, type CreateLoanProductData } from '../../../../types/loans';
import styles from './LoanProductsManagement.module.scss'; // Updated to module.scss

const LoanProductsManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'template' | 'wizard'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(null);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setCurrentView('wizard');
  };

  const handleCustomStart = () => {
    setSelectedTemplate(null);
    setCurrentView('wizard');
  };

  const handleWizardComplete = (productData: CreateLoanProductData) => {
    console.log('Product created:', productData);
    setCurrentView('list');
  };

  const handleWizardCancel = () => {
    setCurrentView('list');
    setSelectedTemplate(null);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: LoanProduct) => {
    setEditingProduct(product);
    setCurrentView('wizard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'template':
        return (
          <TemplateSelection
            onTemplateSelect={handleTemplateSelect}
            onCustomStart={handleCustomStart}
          />
        );
      
      case 'wizard':
        return (
          <ProductCreationWizard
            onComplete={handleWizardComplete}
            onCancel={handleWizardCancel}
            existingProduct={editingProduct}
            template={selectedTemplate}
          />
        );
      
      default:
        return <ProductListView onEditProduct={handleEditProduct} />;
    }
  };

  return (
    <div className={styles.productsManagement}>
      <div className={styles.managementContainer}>
        <div className={styles.managementHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.managementTitle}>Loan Products</h1>
            <p className={styles.managementSubtitle}>Manage your loan product offerings</p>
          </div>
          
          {currentView === 'list' && (
            <div className={styles.headerActions}>
              <button 
                className={styles.createProductButton}
                onClick={() => setCurrentView('template')}
              >
                + Create New Product
              </button>
            </div>
          )}
        </div>

        {renderCurrentView()}
      </div>
    </div>
  );
};

export default LoanProductsManagement;