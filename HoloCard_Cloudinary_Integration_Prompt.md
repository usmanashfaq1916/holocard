# HoloCard — Cloudinary Media Integration Prompt

You are working on the existing **HoloCard** WebAR business-card application. Integrate **Cloudinary** as the production media-storage, optimization, transformation, and delivery service without breaking any existing functionality.

## 1. First Analyze the Existing Project

Before making changes:

- Inspect the complete project structure.
- Identify the current upload system.
- Identify all existing image/video/file upload components.
- Identify how uploaded assets are currently stored.
- Identify the database schema and asset-related tables.
- Identify authentication and authorization logic.
- Identify the AR experience and AR Scene Builder.
- Identify where `.mind` target files, images, videos, 3D assets, thumbnails, logos, and profile photos are handled.
- Identify all existing API routes/server actions related to uploads.
- Do not duplicate existing functionality.
- Do not replace Supabase/NeonDB database functionality.
- Preserve the current UI and existing working features unless an improvement is required.

Create a clean migration plan internally before modifying the code.

---

## 2. Cloudinary Architecture

Use:

### Cloudinary

- Image storage
- Video storage
- Image/video transformations
- Optimization
- CDN delivery
- Thumbnails
- Media metadata

### Existing Database

- User ownership
- Card/project records
- Media records
- Cloudinary `public_id`
- Resource type
- Format
- MIME type
- File size
- Width/height
- Duration
- Secure URL
- Asset type
- Created/updated timestamps

Do **not** store large media files directly inside PostgreSQL/NeonDB.

The database should store references and metadata, while Cloudinary stores the actual media.

---

## 3. Environment Variables

Add the required Cloudinary configuration using environment variables.

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

Never expose:

```env
CLOUDINARY_API_SECRET
```

to the browser.

Add/update `.env.example` with placeholder values.

Never hard-code Cloudinary credentials anywhere in the application.

---

## 4. Cloudinary SDK

Install and configure the official Cloudinary SDK appropriate for the project's existing Next.js architecture.

Create a reusable server-side Cloudinary configuration, for example:

```text
lib/cloudinary/
```

or an equivalent structure consistent with the existing project.

Separate:

- Server-side Cloudinary configuration
- Upload utilities
- Transformation utilities
- Delete utilities
- URL-generation utilities
- Validation utilities

Do not initialize Cloudinary repeatedly throughout the application.

---

## 5. Secure Upload Architecture

Implement secure uploads.

Preferred architecture:

```text
Browser
   ↓
HoloCard Upload API / Signed Upload
   ↓
Cloudinary
   ↓
Cloudinary response
   ↓
Database metadata
```

Use signed uploads where appropriate.

Never expose the Cloudinary API secret to the client.

Validate uploads before accepting them.

---

## 6. Media Types

Support the media types HoloCard needs.

### Images

Support:

- JPG/JPEG
- PNG
- WebP
- SVG where safe
- AVIF where appropriate

Use Cloudinary transformations for:

- resizing
- cropping
- quality optimization
- format conversion
- thumbnails
- responsive images

### Videos

Support common web-compatible formats such as:

- MP4
- WebM where appropriate

Cloudinary should handle:

- video optimization
- thumbnails
- poster images
- responsive delivery
- appropriate transformations

### 3D Assets

Allow appropriate 3D asset formats used by the existing AR experience, such as:

- GLB
- GLTF

Do not automatically transform 3D assets as images.

Preserve their original asset URLs and metadata.

### AR Target Files

For `.mind` files:

- Preserve the existing MindAR workflow.
- Upload/store `.mind` files appropriately.
- Do not send `.mind` files through image transformations.
- Store their Cloudinary reference and metadata in the database if Cloudinary is used for these assets.
- Ensure the AR runtime receives a valid HTTPS URL.

---

## 7. Folder Structure

Use a consistent Cloudinary folder structure.

Example:

```text
holocard/
    users/
        {userId}/
            profile/
            logos/

    cards/
        {cardId}/
            images/
            videos/
            thumbnails/
            models/
            ar/

    projects/
        {projectId}/
            assets/
```

Do not expose internal filesystem paths.

Use Cloudinary `public_id` values to identify assets.

---

## 8. Database Integration

Create or update a media/assets table according to the existing database architecture.

Suggested fields:

```text
id
user_id
card_id
project_id
asset_type
cloudinary_public_id
resource_type
format
mime_type
secure_url
width
height
duration
file_size
folder
created_at
updated_at
```

Use the existing ORM/database conventions.

Do not create a second database system.

Add proper:

- foreign keys
- indexes
- ownership checks
- cascade behavior where appropriate

---

## 9. Upload Component

Improve the existing HoloCard upload interface.

The upload UI should provide:

- Drag & drop
- File picker
- Upload progress
- Upload percentage
- Preview
- File validation
- File size validation
- File type validation
- Upload cancellation where possible
- Success state
- Error state
- Retry button
- Remove/delete button

Example flow:

```text
Select File
      ↓
Validate
      ↓
Preview
      ↓
Upload
      ↓
Progress
      ↓
Cloudinary
      ↓
Save metadata
      ↓
Asset available in HoloCard
```

Do not make the user refresh the page after uploading.

---

## 10. Media Library

Create/improve a reusable **Media Library** for HoloCard.

Users should be able to:

- Upload assets
- View assets
- Search assets
- Filter by type
- Preview assets
- Select an asset
- Delete an asset
- Reuse an existing asset
- Replace an asset

Filters:

```text
All
Images
Videos
3D
AR
Logos
```

Use thumbnails instead of loading original high-resolution files unnecessarily.

---

## 11. HoloCard Designer Integration

Integrate Cloudinary into the existing card designer.

When users add:

- profile image
- company logo
- background image
- card image
- promotional image
- video
- other supported media

the designer should use the Cloudinary asset URL.

Do not duplicate uploads every time an asset is reused.

Store the asset ID/public ID and reference it from the card/project.

---

## 12. AR Scene Builder Integration

Integrate Cloudinary into the AR Scene Builder.

Support assets such as:

- Images
- Videos
- 3D models
- Posters/thumbnails
- AR-related media

Example:

```text
AR Scene
 ├── Image
 │     └── Cloudinary URL
 │
 ├── Video
 │     ├── Cloudinary video URL
 │     └── Poster URL
 │
 └── 3D Model
       └── Asset URL
```

Make sure AR assets load efficiently on mobile devices.

Do not introduce unnecessary downloads of original-resolution files.

---

## 13. Image Optimization

Use Cloudinary transformations for production delivery.

Requirements:

- Automatic format selection
- Automatic quality
- Responsive width
- Thumbnail generation
- Cropping
- Face-aware cropping where useful

Do not permanently modify the original asset just to create a thumbnail.

Generate optimized delivery URLs instead.

---

## 14. Video Optimization

For AR videos:

- Generate appropriate poster images.
- Optimize delivery.
- Avoid unnecessarily large video downloads.
- Support mobile browsers.
- Preserve aspect ratio.
- Provide a fallback poster.
- Ensure videos can be streamed/loaded efficiently.

Do not automatically autoplay videos unless the existing AR experience requires it and browser restrictions are handled correctly.

---

## 15. Delete Assets

When a user deletes an asset:

1. Verify ownership.
2. Delete the Cloudinary asset.
3. Delete/update its database metadata.
4. Remove references from associated projects/cards where necessary.
5. Prevent broken asset references.

Do not allow users to delete another user's assets.

Handle Cloudinary deletion failures gracefully.

---

## 16. Security

Implement:

- Authentication checks
- Ownership validation
- File type validation
- File size limits
- Upload restrictions
- Server-side validation
- Signed uploads where required
- Rate limiting where appropriate
- Secure API routes

Never trust:

- client-provided MIME types
- client-provided user IDs
- client-provided ownership information

Never expose:

```text
CLOUDINARY_API_SECRET
```

in client-side JavaScript.

---

## 17. Error Handling

Handle:

- Cloudinary unavailable
- Upload failure
- Invalid file
- File too large
- Network interruption
- Database failure
- Invalid Cloudinary response
- Missing asset
- Unauthorized deletion
- Expired upload signature

Show useful user-facing messages without exposing credentials or internal errors.

---

## 18. Existing Data Migration

Do not break existing uploaded assets.

First identify how existing HoloCard assets are stored.

If assets currently exist in Supabase Storage:

- Keep existing assets working.
- Do not blindly delete them.
- Add a migration strategy.
- Allow old assets to continue working during migration.
- Provide a safe migration path to Cloudinary.

Do not perform destructive migration automatically.

---

## 19. Performance

Optimize for mobile WebAR.

Requirements:

- Lazy-load media where appropriate.
- Use thumbnails in dashboards.
- Use responsive image delivery.
- Avoid loading original-resolution images unnecessarily.
- Optimize AR video delivery.
- Cache media effectively.
- Avoid duplicate uploads.
- Avoid unnecessary database queries.
- Avoid blocking page rendering on non-critical media.

---

## 20. UI/UX Requirements

Maintain the existing HoloCard visual identity.

The media system should feel like a premium SaaS application.

Use:

- clean upload cards
- drag-and-drop zones
- upload progress indicators
- media previews
- skeleton loading
- empty states
- error states
- confirmation dialogs for deletion

Avoid adding unnecessary buttons.

Keep actions clear:

```text
Upload
Select
Replace
Delete
```

---

## 21. API Design

Create clean API/server-action boundaries for:

```text
POST   /api/media/upload
POST   /api/media/sign
GET    /api/media
GET    /api/media/:id
DELETE /api/media/:id
```

Adapt these routes to the existing project's routing architecture instead of blindly creating duplicate endpoints.

Return consistent JSON responses.

Example:

```json
{
  "success": true,
  "asset": {
    "id": "...",
    "publicId": "...",
    "secureUrl": "...",
    "resourceType": "image",
    "format": "webp"
  }
}
```

---

## 22. Cloudinary URL Strategy

Do not manually construct fragile Cloudinary URLs throughout the application.

Create reusable helpers for:

- Original asset URL
- Thumbnail URL
- Responsive image URL
- Optimized image URL
- Video URL
- Video poster URL

Centralize transformation logic.

---

## 23. Testing

Test the complete upload lifecycle.

### Image

```text
Upload → Cloudinary → Database → Preview → Designer → Published Card
```

### Video

```text
Upload → Optimization → Preview → AR Scene → Mobile Browser
```

### 3D

```text
Upload → Store → AR Scene → Mobile Browser
```

### Delete

```text
Delete → Ownership Check → Cloudinary Delete → Database Update
```

Test:

- authenticated user
- unauthorized user
- invalid file
- oversized file
- upload failure
- network failure
- deleted asset
- missing asset
- mobile viewport

---

## 24. Important Existing HoloCard Requirements

Do not break:

- Authentication
- Dashboard
- Business-card designer
- Digital business card
- Publish flow
- QR codes
- AR routes
- MindAR integration
- `.mind` target workflow
- AR Scene Builder
- Existing database
- Existing user accounts
- Existing published cards

Do not redesign unrelated pages.

Do not replace working components unnecessarily.

---

## 25. Final Quality Check

After implementation:

1. Run linting.
2. Run TypeScript checks.
3. Run the existing test suite.
4. Build the production application.
5. Fix all TypeScript errors.
6. Fix all build errors.
7. Test upload functionality.
8. Test image optimization.
9. Test video delivery.
10. Test AR media loading.
11. Test deletion.
12. Test authorization.
13. Test mobile responsiveness.
14. Verify no Cloudinary secret is exposed to the client.
15. Verify `.env.example` is updated.
16. Verify no hard-coded credentials exist.

Finally provide a concise implementation summary containing:

- Files created/modified
- Environment variables required
- Database changes
- Cloudinary configuration
- Upload flow
- Migration considerations
- Testing performed
- Any remaining limitations

## Critical Rule

**Do not simply add Cloudinary SDK and declare the integration complete.**

The goal is a **production-ready Cloudinary media pipeline integrated throughout HoloCard**, while preserving the existing application architecture and functionality.
