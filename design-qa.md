# Design QA - Certificate-Only Accreditation Section

## Evidence

- Before reference: `.audit/certificate-only-reference.png`
- Desktop implementation: `.audit/certificate-only-desktop.png`
- Mobile implementation: `.audit/certificate-only-mobile.png`
- Side-by-side comparison: `.audit/certificate-only-comparison.png`

## Comparison

- The right column now contains only the supplied certificate preview.
- Certificate metadata, validity copy, category label, full-scope button and certificate button were removed.
- The image itself remains clickable and opens the full certificate PDF in a new tab.
- The left-side `Understand our accreditation` CTA was removed without changing the heading or explanatory copy.
- Desktop keeps a balanced two-column layout; mobile stacks the certificate below the copy.

## Findings

- No actionable P0, P1 or P2 visual issues remain.
- [P3] Fine certificate text requires opening the PDF for full-size reading; the clickable image provides that path.

## Browser checks

- Desktop and mobile accreditation states were rendered and visually inspected.
- Certificate aspect ratio is preserved, alignment is centered and no clipping or horizontal overflow is present.
- HTML and CSS were formatted after implementation.

final result: passed
