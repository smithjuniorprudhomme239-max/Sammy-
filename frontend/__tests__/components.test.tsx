import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

describe('Button component', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Utility functions', () => {
  it('formatPrice formats USD correctly', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
    expect(formatPrice(1000)).toBe('$1,000.00');
  });

  it('getDiscountPercent calculates correctly', () => {
    expect(getDiscountPercent(80, 100)).toBe(20);
    expect(getDiscountPercent(100, 80)).toBe(0);
  });
});
