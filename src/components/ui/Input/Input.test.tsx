import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { Input } from './Input'

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder='Enter text' />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label='Test Label' />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Input variant='default' />)
    expect(screen.getByRole('textbox')).toHaveClass('bg-[var(--bg-secondary)]', 'border')

    rerender(<Input variant='filled' />)
    expect(screen.getByRole('textbox')).toHaveClass('bg-[var(--bg-secondary)]', 'border-0')

    rerender(<Input variant='outlined' />)
    expect(screen.getByRole('textbox')).toHaveClass('bg-transparent', 'border')
  })

  it('renders with left icon', () => {
    const leftIcon = <span data-testid='left-icon'>🔍</span>
    render(<Input leftIcon={leftIcon} />)

    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('pl-10')
  })

  it('renders with right icon', () => {
    const rightIcon = <span data-testid='right-icon'>👁️</span>
    render(<Input rightIcon={rightIcon} />)

    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('pr-10')
  })

  it('shows error message', () => {
    render(<Input error='This field is required' />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).toHaveClass('text-red-500')
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500')
  })

  it('shows helper text when no error', () => {
    render(<Input helperText='This is helpful text' />)
    expect(screen.getByText('This is helpful text')).toBeInTheDocument()
    expect(screen.getByText('This is helpful text')).toHaveClass('text-[var(--text-secondary)]')
  })

  it('does not show helper text when error is present', () => {
    render(<Input error='Error message' helperText='Helper text' />)
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
  })

  it('handles input changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test input' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('test input')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    render(<Input className='custom-input' />)
    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)

    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('supports all input types', () => {
    const { rerender } = render(<Input type='email' />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type='password' />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password')

    rerender(<Input type='number' />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'number')
  })
})
