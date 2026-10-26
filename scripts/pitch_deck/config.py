from pptx.dml.color import RGBColor

# Universal typography for PPTX on macOS & Windows
FONT_PRIMARY = 'Trebuchet MS'
CORNER_RADIUS = 0.035  # 3.5% corner radius for sleek Apple/Linear aesthetic

# High-contrast clinical & tech slate palette
C_DARK = RGBColor(15, 23, 42)          # Slate 900 (Headings, primary text)
C_BODY = RGBColor(51, 65, 85)          # Slate 700 (Readable body copy)
C_MUTED = RGBColor(100, 116, 139)      # Slate 500 (Secondary / Labels)
C_SUBTLE = RGBColor(148, 163, 184)     # Slate 400 (Captions, footnotes)

# Accents
C_BLUE = RGBColor(2, 132, 199)         # Sky 600 (Primary tech / clinical blue)
C_BLUE_DARK = RGBColor(3, 105, 161)    # Sky 700 (Deep accent)
C_BLUE_BG = RGBColor(240, 249, 255)    # Sky 50 (Subtle hero tint)
C_BLUE_BORDER = RGBColor(186, 230, 253)# Sky 200 (Hero border)

C_EMERALD = RGBColor(5, 150, 105)      # Emerald 600 (Success, readiness)
C_EMERALD_BG = RGBColor(236, 253, 245) # Emerald 50 (Success tint)
C_EMERALD_BORDER = RGBColor(167, 243, 208)

C_RED = RGBColor(225, 29, 72)          # Rose 600 (Risks, medical errors)
C_RED_BG = RGBColor(255, 241, 242)     # Rose 50
C_RED_BORDER = RGBColor(254, 205, 211) # Rose 200

C_AMBER = RGBColor(217, 119, 6)        # Amber 600
C_AMBER_BG = RGBColor(254, 243, 199)   # Amber 100
C_AMBER_BORDER = RGBColor(253, 230, 138)

# Cards
C_CARD_BG = RGBColor(255, 255, 255)    # Pure White card
C_CARD_BORDER = RGBColor(226, 232, 240)# Slate 200 (Subtle 1px border)
C_CARD_SLATE_BG = RGBColor(248, 250, 252) # Slate 50
