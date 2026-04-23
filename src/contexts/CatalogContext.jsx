import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { catalogAPI } from '@/utils/catalogAPI';

const CatalogContext = createContext();

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  const [colors, setColors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingColors, setLoadingColors] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [colorSearch, setColorSearch] = useState('');
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUses, setSelectedUses] = useState([]);
  const [selectedFinishes, setSelectedFinishes] = useState([]);

  // Lists for filters
  const [colorFamiliesList, setColorFamiliesList] = useState([]);
  const [productCategoriesList, setProductCategoriesList] = useState([]);
  const [productUsesList, setProductUsesList] = useState([]);
  const [productFinishesList, setProductFinishesList] = useState([]);

  const fetchColors = useCallback(async () => {
    setLoadingColors(true);
    try {
      const data = await catalogAPI.getColors({
        search: colorSearch,
        families: selectedFamilies.join(',')
      });
      setColors(data.colors || []);
      if (data.families && colorFamiliesList.length === 0) setColorFamiliesList(data.families);
    } catch (error) {
      console.error("Failed to fetch colors:", error);
      // Fallback if API fails to keep UI functional
      setColors([]);
    } finally {
      setLoadingColors(false);
    }
  }, [colorSearch, selectedFamilies, colorFamiliesList.length]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await catalogAPI.getProducts({
        search: productSearch,
        categories: selectedCategories.join(','),
        uses: selectedUses.join(','),
        finishes: selectedFinishes.join(',')
      });
      setProducts(data.products || []);
      if (data.categories && productCategoriesList.length === 0) {
        setProductCategoriesList(data.categories);
        setProductUsesList(data.uses || []);
        setProductFinishesList(data.finishes || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [productSearch, selectedCategories, selectedUses, selectedFinishes, productCategoriesList.length]);

  // Debounce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchColors();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchColors]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const toggleFamily = (family) => setSelectedFamilies(prev => prev.includes(family) ? prev.filter(f => f !== family) : [...prev, family]);
  const toggleCategory = (cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  const toggleUse = (use) => setSelectedUses(prev => prev.includes(use) ? prev.filter(u => u !== use) : [...prev, use]);
  const toggleFinish = (finish) => setSelectedFinishes(prev => prev.includes(finish) ? prev.filter(f => f !== finish) : [...prev, finish]);

  const resetColorFilters = () => { setColorSearch(''); setSelectedFamilies([]); };
  const resetProductFilters = () => { setProductSearch(''); setSelectedCategories([]); setSelectedUses([]); setSelectedFinishes([]); };

  return (
    <CatalogContext.Provider value={{
      colors, loadingColors, filteredColors: colors,
      colorSearch, setColorSearch, selectedFamilies, toggleFamily, resetColorFilters, colorFamiliesList,
      
      products, loadingProducts, filteredProducts: products,
      productSearch, setProductSearch, selectedCategories, toggleCategory,
      selectedUses, toggleUse, selectedFinishes, toggleFinish, resetProductFilters,
      productCategoriesList, productUsesList, productFinishesList
    }}>
      {children}
    </CatalogContext.Provider>
  );
};