'use client'

import { useState, useEffect } from 'react'
import { Settings, X, Volume2 } from 'lucide-react'
import ttsService from '@/services/textToSpeechService'

interface TTSSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function TTSSettings({ isOpen, onClose }: TTSSettingsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [rate, setRate] = useState(0.9)
  const [pitch, setPitch] = useState(1.0)
  const [volume, setVolume] = useState(1.0)

  useEffect(() => {
    if (isOpen) {
      const availableVoices = ttsService.getAvailableVoices()
      setVoices(availableVoices)

      // Filtrar vozes em português
      const ptVoices = availableVoices.filter(
        v =>
          v.lang.startsWith('pt') || v.name.toLowerCase().includes('portuguese')
      )

      if (ptVoices.length > 0) {
        setSelectedVoice(ptVoices[0].name)
      }
    }
  }, [isOpen])

  const handleTest = async () => {
    try {
      // Garantir permissão
      if (!ttsService.hasUserInteraction()) {
        await ttsService.requestUserInteraction()
      }

      if (selectedVoice) {
        ttsService.setVoiceByName(selectedVoice)
      }
      ttsService.setConfig({ rate, pitch, volume })

      await ttsService.speak(
        'Senha O R T F P, zero zero um, zero zero quatro, para Atendimento Ortopédico, fila Fila Prioritária, cidadão João Silva'
      )
    } catch (error) {
      alert(
        'Erro ao reproduzir o teste de áudio. Verifique as permissões do navegador.'
      )
    }
  }

  const handleSave = () => {
    if (selectedVoice) {
      ttsService.setVoiceByName(selectedVoice)
    }
    ttsService.setConfig({ rate, pitch, volume })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-green-100 rounded-full p-2'>
              <Settings className='w-5 h-5 text-green-600' />
            </div>
            <h2 className='text-xl font-bold text-gray-900'>
              Configurações de Áudio
            </h2>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Conteúdo */}
        <div className='space-y-4'>
          {/* Seleção de Voz */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Voz
            </label>
            <select
              value={selectedVoice}
              onChange={e => setSelectedVoice(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
            >
              {voices.length === 0 ? (
                <option>Nenhuma voz disponível</option>
              ) : (
                voices
                  .filter(
                    v =>
                      v.lang.startsWith('pt') ||
                      v.name.toLowerCase().includes('portuguese') ||
                      v.name.toLowerCase().includes('brazil')
                  )
                  .map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))
              )}
            </select>
          </div>

          {/* Velocidade */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Velocidade: {rate.toFixed(1)}x
            </label>
            <input
              type='range'
              min='0.5'
              max='2'
              step='0.1'
              value={rate}
              onChange={e => setRate(parseFloat(e.target.value))}
              className='w-full accent-green-600'
            />
            <div className='flex justify-between text-xs text-gray-500 mt-1'>
              <span>Lento</span>
              <span>Normal</span>
              <span>Rápido</span>
            </div>
          </div>

          {/* Tom */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Tom: {pitch.toFixed(1)}
            </label>
            <input
              type='range'
              min='0.5'
              max='2'
              step='0.1'
              value={pitch}
              onChange={e => setPitch(parseFloat(e.target.value))}
              className='w-full accent-green-600'
            />
            <div className='flex justify-between text-xs text-gray-500 mt-1'>
              <span>Grave</span>
              <span>Normal</span>
              <span>Agudo</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type='range'
              min='0'
              max='1'
              step='0.1'
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className='w-full accent-green-600'
            />
          </div>
        </div>

        {/* Botões */}
        <div className='flex gap-3 mt-6'>
          <button
            onClick={handleTest}
            className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium'
          >
            <Volume2 className='w-4 h-4' />
            Testar
          </button>
          <button
            onClick={handleSave}
            className='flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium'
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
