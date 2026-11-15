import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })
  const stamp = Date.now()

  const draft = await payload.create({
    collection: 'posts',
    draft: true,
    data: {
      title: 'Audit Draft',
      slug: `audit-draft-${stamp}`,
      excerpt: 'Szkic audytowy nie powinien byc publiczny.',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'secret', version: 1 }],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      category: 'aktualnosci',
      _status: 'draft',
    },
    context: { disableRevalidate: true },
  })

  const inactive = await payload.create({
    collection: 'pricing-plans',
    data: {
      name: 'Audit Hidden Plan',
      slug: `audit-hidden-${stamp}`,
      type: 'single',
      priceAmount: 12345,
      currency: 'PLN',
      active: false,
      displayOrder: 999,
    },
    context: { disableRevalidate: true },
  })

  const unapproved = await payload.create({
    collection: 'testimonials',
    data: {
      authorName: 'Audit Ghost',
      content: 'Niezatwierdzona opinia audytowa.',
      approved: false,
      displayOrder: 999,
    },
    context: { disableRevalidate: true },
  })

  const publicDraft = await payload.find({
    collection: 'posts',
    where: { slug: { equals: draft.slug } },
    overrideAccess: false,
    draft: false,
  })

  const publicPlan = await payload.find({
    collection: 'pricing-plans',
    where: { slug: { equals: inactive.slug } },
    overrideAccess: false,
  })

  const publicTestimonial = await payload.find({
    collection: 'testimonials',
    where: { id: { equals: unapproved.id } },
    overrideAccess: false,
  })

  const editorCreateUser = await payload
    .create({
      collection: 'users',
      data: {
        email: `audit-editor-${stamp}@test.local`,
        password: 'AuditEditor123!',
        name: 'Audit Editor',
        role: 'editor',
        active: true,
      },
      overrideAccess: false,
    })
    .then(() => 'UNEXPECTED_SUCCESS')
    .catch((error: Error) => error.message)

  console.log(
    JSON.stringify(
      {
        draftSlug: draft.slug,
        publicDraftCount: publicDraft.docs.length,
        inactivePlanVisible: publicPlan.docs.length,
        unapprovedVisible: publicTestimonial.docs.length,
        unauthenticatedUserCreate: editorCreateUser,
      },
      null,
      2,
    ),
  )

  await payload.delete({ collection: 'posts', id: draft.id, context: { disableRevalidate: true } })
  await payload.delete({
    collection: 'pricing-plans',
    id: inactive.id,
    context: { disableRevalidate: true },
  })
  await payload.delete({
    collection: 'testimonials',
    id: unapproved.id,
    context: { disableRevalidate: true },
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
