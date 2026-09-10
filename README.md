# Dr Bhasin's Lab — Axis Template Website Draft

This build regenerates the approved Phase 1 website content in a visual system based on the uploaded BootstrapMade **Axis** corporate template. It adopts the Axis template's fixed corporate header, split hero, icon-led service grid, alternating showcase cards, team cards, service-detail sidebar and dark footer.

## Open locally

Run `python server.py` in this folder and open `http://localhost:2010`. The pages can also be opened directly, though a local server is preferable.

## Pages included

- Homepage
- About
- Home Collection
- 24x7 Laboratory
- Health Check-ups
- Paediatric Collection
- Semen Analysis & DFI
- Services Overview
- Accreditation & Quality
- Medical Team
- For Doctors
- Medical Specialities
- CGHS Services
- Institutional Services
- Careers
- Contact
- Privacy draft
- Terms and medical disclaimer draft
- 404 page
- Starter page for Phase 2

## Important implementation notes

- Forms are intentionally non-functional. Connect them to the CRM, add reCAPTCHA and approve consent/privacy wording before launch.
- Public pages are marked `index,follow`; the 404 and starter pages remain excluded from search results.
- Replace every photography placeholder with authentic photography according to the embedded brief.
- Do not publish patient labels, reports, prescriptions or screens unless staged/masked and properly consented.
- Keep NABL wording tied to the accredited GK-I site and current scope.
- Review `CONTENT_VERIFICATION_REGISTER.md` before deployment.
- The supplied Axis template licence terms remain applicable. See `TEMPLATE_LICENSE.txt`.
