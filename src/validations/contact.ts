import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Podaj imię (minimum 2 znaki).')
    .max(100, 'Imię jest zbyt długie.'),
  email: z.string().trim().email('Podaj prawidłowy adres e-mail.'),
  phone: z
    .string()
    .trim()
    .max(30, 'Numer telefonu jest zbyt długi.')
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .trim()
    .min(3, 'Podaj temat wiadomości.')
    .max(150, 'Temat jest zbyt długi.'),
  message: z
    .string()
    .trim()
    .min(10, 'Wiadomość powinna mieć co najmniej 10 znaków.')
    .max(5000, 'Wiadomość jest zbyt długa.'),
  privacyAccepted: z.boolean().refine((value) => value === true, {
    message: 'Musisz potwierdzić zapoznanie się z polityką prywatności.',
  }),
  // Honeypot: bots fill this; non-empty values are accepted here and dropped in the API.
  website: z.string().max(200).optional().or(z.literal('')),
  turnstileToken: z.string().optional(),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
