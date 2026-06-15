#!/usr/bin/env python3
"""
Generate PNG favicon from SVG
"""

import subprocess
import os

svg_path = "/home/markusbot/vic-tour/public/favicon.svg"
png_path = "/home/markusbot/vic-tour/public/favicon.png"

# Try to convert using ImageMagick
try:
    subprocess.run([
        'convert',
        '-background', 'none',
        '-resize', '32x32',
        svg_path,
        png_path
    ], check=True, capture_output=True)
    print("✓ Created favicon.png using ImageMagick")
except:
    # Create a simple placeholder PNG if ImageMagick not available
    print("⚠ ImageMagick not found, creating placeholder...")
    # Minimal 32x32 PNG (blue trophy icon placeholder)
    import base64
    png_data = base64.b64decode(
        'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB'
        'OElEQVR4nO2WQUoDQRBFa3QhiOABvIB6AA/gCbyCRxDxAK7cuXHrTkEQQRDBhRtFEMSAiYtJJ9Pd'
        '1f3/oKu7Zyb9X1V3d01VdVV3AwAAAAAAAAAA4P9jBtwC18A88AR8Bq9gBtwAV8A0MAF8Ae/AJ7AD'
        '7oFb4KoqYBp4Bb6AFWAK2ANegEtgqgpgEjgHNoFzYB24AtaAaWCqKmACOAQ2gDVgFTgF1oEpYLIq'
        'YBw4AraAVWAVOAFWgQlgqipgDDgEtoBVYAU4BpaBcWCqKmAUOAS2gFVgGTgGloExYKoqYAQ4ALaA'
        'VWAZOAKWgVFgqipgGNgHtoBVYAk4AhaBEXSqKmAI2AdWgWVgETgE5oFhdKoqYBDYA1aBZWABOATm'
        'gGF0qipgANgFVoEVYB44AOaAQXSqKqAf2AFWgRVgHtgH5oBBdKoqoA/YBlaBZWAP2APmgUF0qiqg'
        'F9gGVoFlYA/YA+aBQXSqKqAH2AJWgWVgD9gD5oFBdKoqoBvYBFaBZWAP2APmgEF0qiqgC9gEVoFl'
        'YA/YA+aAQXSqKqAT2ARWgWVgD9gD5oFBdKoqoBPYBFaBZWAP2APmgEF0qiqgA9gEVoFlYA/YA+aA'
        'QXSqKqAd2ARWgWVgD9gD5oBBdKoqoA3YBFaBZWAP2APmgEF0qiqgFdgEVoFlYA/YA+aAQXSqKqAF'
        '2ARWgWVgD9gD5oBBdKoqoBnYBFaBZWAP2APmgEF0qiqgCdgEVoFlYA/YA+aAQXSqKqAJ2ARWgWVg'
        'D9gD5oBBdKoqoBHYBFaBZWAP2APmgEF0qiqgAdgEVoFlYA/YA+aAQXSqKqAe2ARWgWVgD9gD5oBB'
        'dKoqoA7YBFaBZWAP2APmgEF0qiqgFtgEVoFlYA/YA+aAQXSqKqAG2ARWgWVgD9gD5oBBdKoqoBrY'
        'BFaBZWAP2APmgEF0qiqgCtgEVoFlYA/YA+aAQXSqKqAS2ARWgWVgD9gD5oBBdKoq4B9+AXz9WqZv'
        'AAAAAElFTkSuQmCC'
    )
    with open(png_path, 'wb') as f:
        f.write(png_data)
    print("✓ Created placeholder favicon.png")

print(f"✓ Favicon saved to: {png_path}")
