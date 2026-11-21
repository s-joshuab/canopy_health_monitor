import { Link } from 'react-router-dom'
import { ArrowLeft, Leaf } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { buttonClass } from '../lib/buttonStyles'

export default function NotFound() {
  return (
    <div>
      <PageHeader
        title="Page not found"
        description="The monitoring view you requested does not exist."
      />
      <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
          <Leaf className="h-5 w-5" />
        </div>
        <p className="mt-4 font-mono text-[32px] leading-none text-ink">404</p>
        <p className="mt-2 text-[12px] text-muted">
          This path is outside the Region 1 monitoring workspace.
        </p>
        <Link to="/" className={buttonClass('primary', 'md', 'mt-4')}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
