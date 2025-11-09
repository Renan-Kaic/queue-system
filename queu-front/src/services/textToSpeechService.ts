/**
 * Serviço de Text-to-Speech (TTS) para anúncio de tickets
 * Utiliza a Web Speech API nativa do navegador
 */

export interface TTSConfig {
  lang?: string
  rate?: number // Velocidade (0.1 - 10, padrão 1)
  pitch?: number // Tom (0 - 2, padrão 1)
  volume?: number // Volume (0 - 1, padrão 1)
  voice?: SpeechSynthesisVoice | null
}

export interface TicketAnnouncement {
  ticketCode: string
  departmentName: string
  queueName: string
  citizenName?: string
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private config: TTSConfig = {
    lang: 'pt-BR',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    voice: null,
  }
  private isInitialized = false
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private userInteractionGranted = false
  private pendingAnnouncements: Array<() => Promise<void>> = []

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
      this.loadVoices()
    } else {
    }
  }


  private loadVoices() {
    if (!this.synthesis) return

    const loadVoicesList = () => {
      this.voices = this.synthesis!.getVoices()

      if (this.voices.length > 0) {
        this.isInitialized = true

        const ptBRVoice = this.voices.find(
          (voice) =>
            voice.lang === 'pt-BR' ||
            voice.lang.startsWith('pt-') ||
            voice.name.toLowerCase().includes('portuguese') ||
            voice.name.toLowerCase().includes('brazil')
        )

        if (ptBRVoice) {
          this.config.voice = ptBRVoice
        } else {
          this.config.voice = this.voices[0]
        }
      }
    }

    loadVoicesList()

    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoicesList
    }
  }

  /**
   * Verifica se o TTS está disponível e inicializado
   */
  isAvailable(): boolean {
    return this.synthesis !== null && this.isInitialized
  }

  /**
   * Verifica se o usuário já concedeu permissão para áudio
   */
  hasUserInteraction(): boolean {
    return this.userInteractionGranted
  }

  /**
   * Solicita permissão do usuário para reproduzir áudio
   * Deve ser chamado em resposta a uma interação do usuário (clique, etc)
   */
  async requestUserInteraction(): Promise<boolean> {
    if (!this.isAvailable()) {
      return false
    }

    try {
      // Reproduzir um áudio silencioso para obter permissão
      const utterance = new SpeechSynthesisUtterance('')
      utterance.volume = 0.01

      await new Promise<void>((resolve, reject) => {
        utterance.onend = () => {
          this.userInteractionGranted = true
          resolve()
        }
        utterance.onerror = (event) => {

          reject(new Error(event.error))
        }
        this.synthesis!.speak(utterance)
      })

      // Processar anúncios pendentes
      if (this.userInteractionGranted && this.pendingAnnouncements.length > 0) {
        const pending = [...this.pendingAnnouncements]
        this.pendingAnnouncements = []

        for (const announcement of pending) {
          try {
            await announcement()
          } catch (err) {
          }
        }
      }

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Lista todas as vozes disponíveis
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  /**
   * Configura as opções do TTS
   */
  setConfig(config: Partial<TTSConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * Define uma voz específica pelo nome
   */
  setVoiceByName(voiceName: string): boolean {
    const voice = this.voices.find((v) => v.name === voiceName)
    if (voice) {
      this.config.voice = voice
      return true
    }
    return false
  }

  /**
   * Para qualquer fala em andamento
   */
  stop() {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.currentUtterance = null
    }
  }

  /**
   * Pausa a fala atual
   */
  pause() {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.pause()
    }
  }

  /**
   * Resume a fala pausada
   */
  resume() {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume()
    }
  }

  /**
   * Fala um texto genérico
   */
  speak(text: string, onEnd?: () => void, onError?: (error: Error) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) {
        const error = new Error('TTS não está disponível')
        onError?.(error)
        reject(error)
        return
      }

      // Verificar se tem permissão do usuário
      if (!this.userInteractionGranted) {
        const error = new Error('Permissão de áudio não concedida. Clique no botão de áudio primeiro.')
        onError?.(error)
        reject(error)
        return
      }

      // Parar qualquer fala em andamento
      this.stop()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = this.config.lang || 'pt-BR'
      utterance.rate = this.config.rate || 0.9
      utterance.pitch = this.config.pitch || 1.0
      utterance.volume = this.config.volume || 1.0

      if (this.config.voice) {
        utterance.voice = this.config.voice
      }

      utterance.onend = () => {
        this.currentUtterance = null
        onEnd?.()
        resolve()
      }

      utterance.onerror = (event) => {
        const error = new Error(`Erro no TTS: ${event.error}`)

        // Se for erro de permissão, resetar flag
        if (event.error === 'not-allowed') {
          this.userInteractionGranted = false
        }

        this.currentUtterance = null
        onError?.(error)
        reject(error)
      }

      this.currentUtterance = utterance
      this.synthesis!.speak(utterance)

    })
  }

  /**
   * Anuncia um ticket chamado
   * Formato: "Senha [código] para [departamento], fila [nome da fila], cidadão [nome]"
   */
  async announceTicket(announcement: TicketAnnouncement): Promise<void> {
    const doAnnouncement = async () => {
      try {
        // Formatar o código da senha (separar letras e números)
        const formattedCode = this.formatTicketCode(announcement.ticketCode)

        // Construir a mensagem
        let message = `Senha ${formattedCode}`

        if (announcement.departmentName) {
          message += `, para ${announcement.departmentName}`
        }

        if (announcement.queueName) {
          message += `, fila ${announcement.queueName}`
        }

        if (announcement.citizenName) {
          message += `, usuário ${announcement.citizenName}`
        }


        await this.speak(message)
      } catch (error) {
        throw error
      }
    }

    if (!this.userInteractionGranted) {
      this.pendingAnnouncements.push(doAnnouncement)
      return
    }

    await doAnnouncement()
  }

  private formatTicketCode(code: string): string {
    // Separar por hífen
    const parts = code.split('-')

    if (parts.length === 0) return code

    const formattedParts: string[] = []

    parts.forEach((part, index) => {
      if (index === 0) {
        // Primeira parte (letras): separar cada letra
        // "ORTFP" -> "O R T F P"
        formattedParts.push(part.split('').join(' '))
      } else {
        // Partes numéricas: ler como números individuais ou dígitos
        if (part.length <= 3) {
          // Números pequenos: ler cada dígito
          // "001" -> "zero zero um"
          const digits = part.split('').map(this.digitToWord).join(' ')
          formattedParts.push(digits)
        } else {
          // Números maiores: ler normalmente
          formattedParts.push(part)
        }
      }
    })

    return formattedParts.join(', ')
  }

  /**
   * Converte um dígito para palavra
   */
  private digitToWord(digit: string): string {
    const digitMap: { [key: string]: string } = {
      '0': 'zero',
      '1': 'um',
      '2': 'dois',
      '3': 'três',
      '4': 'quatro',
      '5': 'cinco',
      '6': 'seis',
      '7': 'sete',
      '8': 'oito',
      '9': 'nove',
    }
    return digitMap[digit] || digit
  }

  /**
   * Anuncia um ticket de forma simplificada (apenas código)
   */
  async announceTicketSimple(ticketCode: string): Promise<void> {
    const formattedCode = this.formatTicketCode(ticketCode)
    const message = `Senha ${formattedCode}`
    await this.speak(message)
  }

  /**
   * Testa o TTS falando uma mensagem de teste
   */
  async test(): Promise<void> {
    await this.speak('Sistema de chamada de senhas ativado. Teste de áudio funcionando corretamente.')
  }
}

// Exportar instância singleton
const ttsService = new TextToSpeechService()
export default ttsService
