import { z } from 'zod';

export const videoMetadataSchema = z.object({
  name: z.string()
    .min(1, 'Video başlığı gereklidir')
    .max(50, 'Video başlığı en fazla 50 karakter olabilir'),
  description: z.string()
    .max(500, 'Açıklama en fazla 500 karakter olabilir')
    .optional(),
  category: z.string({
    required_error: 'Lütfen bir kategori seçin'
  })
});

export const videoEditSchema = z.object({
  name: z.string()
    .min(1, 'Video başlığı gereklidir')
    .max(50, 'Video başlığı en fazla 50 karakter olabilir'),
  description: z.string()
    .max(500, 'Açıklama en fazla 500 karakter olabilir')
    .optional()
});

export type VideoMetadataForm = z.infer<typeof videoMetadataSchema>;
export type VideoEditForm = z.infer<typeof videoEditSchema>;

// Video formu için şema tanımı
export const videoSchema = z.object({
  name: z.string().min(1, 'Video adı gereklidir'),
  description: z.string().optional(),
  category: z.enum(['family', 'friends', 'travel', 'events', 'memories', 'other'], {
    errorMap: () => ({ message: 'Geçerli bir kategori seçin' }),
  }),
});

// VideoForm tipi, videoSchema'dan türetilir
export type VideoForm = z.infer<typeof videoSchema>; 