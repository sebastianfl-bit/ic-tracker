# IC Tracker - Registro de Interconsultas Urgencia CAS

PWA para registrar interconsultas en la urgencia de Clínica Alemana de Santiago, con OCR automático via Gemini y sync a Google Sheets.

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `index.html` | App principal |
| `manifest.json` | Manifiesto PWA |
| `sw.js` | Service worker (offline) |
| `icon-192.png` | Ícono 192px |
| `icon-512.png` | Ícono 512px |
| `apps-script.js` | Código para Google Apps Script (sync a Sheets) |

## Despliegue desde terminal Ubuntu

```bash
# 1. Crear directorio y copiar archivos
mkdir -p ~/proyectos/ic-tracker
cp index.html manifest.json sw.js icon-192.png icon-512.png apps-script.js ~/proyectos/ic-tracker/
cd ~/proyectos/ic-tracker

# 2. Crear repo en GitHub (necesitas gh CLI instalado)
#    Si no tienes gh: sudo apt install gh && gh auth login
gh repo create ic-tracker --public --source=. --remote=origin

# 3. O si prefieres hacerlo manual:
git init
git add .
git commit -m "IC Tracker PWA"
git branch -M main
git remote add origin git@github.com:sebastianfl-bit/ic-tracker.git
git push -u origin main

# 4. Activar GitHub Pages
gh api repos/sebastianfl-bit/ic-tracker/pages \
  -X POST \
  -f source[branch]=main \
  -f source[path]="/" \
  --silent && echo "Pages activado"

# Si falla, hacerlo manual:
# GitHub.com → repo → Settings → Pages → Source: main branch → Save
```

La app queda en: `https://sebastianfl-bit.github.io/ic-tracker/`

## API Key de Gemini

1. Ir a **https://aistudio.google.com/apikeys**
2. Si ya tienes una key (de InterUrg), usa esa misma
3. Si no, clic en **"Create API Key"** → selecciona un proyecto → copiar
4. Pega la key en IC Tracker → ⚙ → API Key Gemini

## Configurar Google Sheets Sync

### Paso 1: Crear la planilla
1. Abre https://sheets.google.com
2. Crea una hoja nueva → nómbrala **"IC Urgencia CAS"**
3. Copia el ID de la URL: `https://docs.google.com/spreadsheets/d/` **ESTE_ES_EL_ID** `/edit`

### Paso 2: Crear el Apps Script
1. En la planilla, ve a **Extensiones → Apps Script**
2. Borra el código que aparece
3. Pega el contenido completo de `apps-script.js`
4. En la línea `const SPREADSHEET_ID = ...` pega el ID de tu planilla
5. **Ctrl+S** para guardar

### Paso 3: Implementar
1. Clic en **"Implementar" → "Nueva implementación"**
2. Tipo: **Aplicación web**
3. Ejecutar como: **Yo (tu email)**
4. Acceso: **Cualquier persona**
5. Clic en **"Implementar"**
6. Autoriza los permisos cuando te lo pida
7. Copia la **URL** que aparece

### Paso 4: Configurar en IC Tracker
1. Abre IC Tracker → ⚙
2. Pega la URL en **"URL Apps Script"**
3. Guardar

Ahora el botón "📤 Sync a Sheets" enviará los datos del mes a tu planilla. Cada mes se crea como una pestaña separada.

## Horario Inhábil (Reglamento CAS Art. 47)

| Día | Hábil | Inhábil (recargo 50%) |
|-----|-------|-----------------------|
| Lunes a Viernes | 07:00 - 21:00 | < 07:00 o ≥ 21:00 |
| Sábado | 07:00 - 14:00 | < 07:00 o ≥ 14:00 |
| Domingo | - | Todo el día |
| Festivos | - | Todo el día |
