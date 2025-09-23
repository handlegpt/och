import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils'
import { Modal } from './Modal'

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    children: <div>Modal content</div>,
  }

  it('renders when open', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('renders with title', () => {
    render(<Modal {...defaultProps} title='Test Modal' />)
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Modal {...defaultProps} size='sm' />)
    expect(screen.getByRole('dialog')).toHaveClass('max-w-md')

    rerender(<Modal {...defaultProps} size='md' />)
    expect(screen.getByRole('dialog')).toHaveClass('max-w-lg')

    rerender(<Modal {...defaultProps} size='lg' />)
    expect(screen.getByRole('dialog')).toHaveClass('max-w-2xl')

    rerender(<Modal {...defaultProps} size='xl' />)
    expect(screen.getByRole('dialog')).toHaveClass('max-w-4xl')
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} title='Test Modal' />)

    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick />)

    const overlay = screen.getByRole('dialog').parentElement
    if (overlay) fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when overlay click is disabled', () => {
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} closeOnOverlayClick={false} />)

    const overlay = screen.getByRole('dialog').parentElement
    if (overlay) fireEvent.click(overlay)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when ESC key is pressed', () => {
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose for other keys', () => {
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Enter' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('prevents body scroll when open', () => {
    render(<Modal {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />)
    expect(document.body.style.overflow).toBe('hidden')

    rerender(<Modal {...defaultProps} isOpen={false} />)
    expect(document.body.style.overflow).toBe('unset')
  })

  it('does not show close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} title='Test Modal' showCloseButton={false} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Modal {...defaultProps} className='custom-modal' />)
    expect(screen.getByRole('dialog')).toHaveClass('custom-modal')
  })

  it('stops propagation when modal content is clicked', () => {
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} />)

    const modalContent = screen.getByRole('dialog')
    fireEvent.click(modalContent)
    expect(onClose).not.toHaveBeenCalled()
  })
})
