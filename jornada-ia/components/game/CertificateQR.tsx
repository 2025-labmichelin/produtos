'use client'

import { QRCodeSVG } from 'qrcode.react'

interface CertificateQRProps {
  url: string
  size?: number
}

export default function CertificateQR({ url, size = 120 }: CertificateQRProps) {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{
        padding: 10,
        background: '#fff',
        border: '1.5px solid #C8B88A',
        borderRadius: 6,
        boxShadow: '2px 2px 0px #C8B88A',
        lineHeight: 0,
      }}>
        <QRCodeSVG
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#3A3228"
          level="M"
          marginSize={0}
        />
      </div>
      <span style={{
        fontFamily: 'Raleway, system-ui, sans-serif',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: '#A89070',
      }}>
        ESCANEAR PARA VERIFICAR
      </span>
    </div>
  )
}
