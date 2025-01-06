import { updateProductCostsOnPriceChange } from '../../utils/costs/updateCosts';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';

jest.mock('../../lib/firebase', () => ({
  database: {},
  ref: jest.fn(),
}));

describe('updateProductCostsOnPriceChange', () => {
  it('should update product costs when cost price changes', async () => {
    const mockProductCosts = {
      'product1': [
        { costId: 'cost1', quantity: 2, pricePerUnit: 10 }
      ]
    };
    
    const mockProduct = {
      fixedCost: 20
    };

    const mockGet = jest.fn()
      .mockResolvedValueOnce({ exists: () => true, val: () => mockProductCosts })
      .mockResolvedValueOnce({ exists: () => true, val: () => mockProduct });

    const mockUpdate = jest.fn();

    (ref as jest.Mock).mockReturnValue({});
    (get as jest.Mock).mockImplementation(mockGet);
    database.ref = jest.fn().mockReturnValue({ update: mockUpdate });

    await updateProductCostsOnPriceChange('cost1', 15);

    expect(mockUpdate).toHaveBeenCalledWith({
      'products/product1/fixedCost': 30
    });
  });
});