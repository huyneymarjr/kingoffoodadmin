import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { ManagementPromotions } from '@/pages';

describe('ManagementPromotions', () => {
  test('should render ManagementPromotions', () => {
    render(<ManagementPromotions />);
    const text = screen.getByText(/Quản lý/i);
    expect(text).toBeInTheDocument();
  });

  // test('should render ModalAddPromotion', () => {
  //   render(<ModalAddPromotion />);
  //   const text = screen.getByText(/Add Promotion/i);
  //   expect(text).toBeInTheDocument();
  // });
});
