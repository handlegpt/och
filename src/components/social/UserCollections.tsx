import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useTranslation } from '../../../i18n/context'
import { supabase } from '../../lib/supabase'

interface Collection {
  id: string
  name: string
  description?: string
  is_public: boolean
  cover_image_url?: string
  item_count: number
  created_at: string
  updated_at: string
}

// interface CollectionItem {
//   id: string
//   gallery_id: string
//   title: string
//   image_url: string
//   transformation_type: string
//   added_at: string
// }

interface UserCollectionsProps {
  userId?: string
  isOwnProfile?: boolean
}

export const UserCollections: React.FC<UserCollectionsProps> = ({
  userId,
  isOwnProfile = false,
}) => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchCollections()
  }, [userId, fetchCollections])

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)

      const targetUserId = userId || user?.id
      if (!targetUserId) return

      const { data, error } = await supabase
        .from('user_collections')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCollections(data || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, user])

  const createCollection = async (name: string, description: string, isPublic: boolean) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_collections')
        .insert({
          user_id: user.id,
          name,
          description,
          is_public: isPublic,
        })
        .select()
        .single()

      if (error) throw error

      setCollections(prev => [data, ...prev])
      setShowCreateForm(false)
    } catch (error) {
      console.error('Error creating collection:', error)
    }
  }

  const deleteCollection = async (collectionId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_collections')
        .delete()
        .eq('id', collectionId)
        .eq('user_id', user.id)

      if (error) throw error

      setCollections(prev => prev.filter(c => c.id !== collectionId))
    } catch (error) {
      console.error('Error deleting collection:', error)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-primary)]'></div>
      </div>
    )
  }

  return (
    <div className='user-collections'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-[var(--text-primary)]'>
          {t('social.collections.title')}
        </h2>
        {isOwnProfile && (
          <button
            onClick={() => setShowCreateForm(true)}
            className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity'
          >
            {t('social.collections.createNew')}
          </button>
        )}
      </div>

      {showCreateForm && (
        <CreateCollectionForm
          onSubmit={createCollection}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {collections.map(collection => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            isOwnProfile={isOwnProfile}
            onDelete={deleteCollection}
          />
        ))}
      </div>

      {collections.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>📚</div>
          <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-2'>
            {t('social.collections.empty.title')}
          </h3>
          <p className='text-[var(--text-secondary)] mb-4'>
            {t('social.collections.empty.description')}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => setShowCreateForm(true)}
              className='px-6 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity'
            >
              {t('social.collections.createFirst')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface CreateCollectionFormProps {
  onSubmit: (name: string, description: string, isPublic: boolean) => void
  onCancel: () => void
}

const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), description.trim(), isPublic)
    }
  }

  return (
    <div className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] p-6 mb-6'>
      <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-4'>
        {t('social.collections.createNew')}
      </h3>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            {t('social.collections.name')}
          </label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent'
            placeholder={t('social.collections.namePlaceholder')}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-[var(--text-primary)] mb-2'>
            {t('social.collections.description')}
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className='w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent'
            placeholder={t('social.collections.descriptionPlaceholder')}
            rows={3}
          />
        </div>

        <div className='flex items-center'>
          <input
            type='checkbox'
            id='isPublic'
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
            className='mr-2'
          />
          <label htmlFor='isPublic' className='text-sm text-[var(--text-primary)]'>
            {t('social.collections.makePublic')}
          </label>
        </div>

        <div className='flex gap-3'>
          <button
            type='submit'
            className='px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity'
          >
            {t('social.collections.create')}
          </button>
          <button
            type='button'
            onClick={onCancel}
            className='px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg hover:opacity-90 transition-opacity'
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}

interface CollectionCardProps {
  collection: Collection
  isOwnProfile: boolean
  onDelete: (collectionId: string) => void
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, isOwnProfile, onDelete }) => {
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className='bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] overflow-hidden hover:shadow-lg transition-shadow'>
      {/* 封面图片 */}
      <div className='aspect-video relative'>
        {collection.cover_image_url ? (
          <img
            src={collection.cover_image_url}
            alt={collection.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center'>
            <span className='text-4xl'>📚</span>
          </div>
        )}

        {isOwnProfile && (
          <div className='absolute top-2 right-2'>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className='p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* 内容信息 */}
      <div className='p-4'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='font-semibold text-[var(--text-primary)]'>{collection.name}</h3>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              collection.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {collection.is_public
              ? t('social.collections.public')
              : t('social.collections.private')}
          </span>
        </div>

        {collection.description && (
          <p className='text-sm text-[var(--text-secondary)] mb-3'>{collection.description}</p>
        )}

        <div className='flex items-center justify-between text-sm text-[var(--text-secondary)]'>
          <span>
            {collection.item_count} {t('social.collections.items')}
          </span>
          <span>{new Date(collection.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 删除确认 */}
      {showDeleteConfirm && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10'>
          <div className='bg-[var(--bg-card)] rounded-lg p-4 m-4'>
            <p className='text-[var(--text-primary)] mb-4'>
              {t('social.collections.deleteConfirm')}
            </p>
            <div className='flex gap-2'>
              <button
                onClick={() => onDelete(collection.id)}
                className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
              >
                {t('common.delete')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className='px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded'
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
