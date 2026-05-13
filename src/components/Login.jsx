import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, AtSign, Phone, AlertCircle, Check,
} from 'lucide-react'
import { cn } from '../lib/utils'

const easeOut = [0.16, 1, 0.3, 1]

function InputField({ icon: Icon, label, type = 'text', value, onChange, placeholder, required, suffix, error, autoFocus }) {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.length > 0

  return (
    <div>
      <label className={cn('block text-xs font-mono tracking-wider mb-1.5 transition-colors duration-200',
        error ? 'text-red-400' : focused ? 'text-[rgb(var(--quantum-300))]' : 'text-white/35')}>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative group">
        <Icon className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200',
          error ? 'text-red-400' : focused ? 'text-[rgb(var(--quantum-400))]' : 'text-white/20')} />
        <input type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          autoFocus={autoFocus}
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/25 text-sm outline-none transition-all duration-200',
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' :
            focused ? 'border-[rgb(var(--quantum-500))] ring-2 ring-[rgb(var(--quantum-500)/.12)]' :
            'border-white/10 hover:border-white/20',
            suffix && 'pr-12'
          )}
          placeholder={placeholder} required={required} />
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
        {error && (
          <div className="flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span className="text-xs text-red-400/80">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Login({ onComplete }) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [formData, setFormData] = useState({ displayName: '', username: '', email: '', phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const containerRef = useRef(null)

  useEffect(() => {
    const handle = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const validate = () => {
    const errs = {}
    if (!isLogin && !formData.displayName.trim()) errs.displayName = 'El nombre es obligatorio'
    if (!isLogin && !formData.username.trim()) errs.username = 'El username es obligatorio'
    if (!formData.email.trim()) errs.email = 'El email es obligatorio'
    else if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Email inválido'
    if (!formData.password) errs.password = 'La contraseña es obligatoria'
    else if (!isLogin && formData.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    return errs
  }

  const set = (key) => (e) => {
    setFormData(p => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1800))
    onComplete()
  }

  const switchMode = () => {
    setIsLogin(p => !p)
    setFormData({ displayName: '', username: '', email: '', phone: '', password: '' })
    setErrors({})
    setTouched({})
  }

  const pwToggle = (
    <button type="button" onClick={() => setShowPassword(p => !p)}
      className={cn('transition-colors', showPassword ? 'text-[rgb(var(--quantum-300))]' : 'text-white/25 hover:text-white/50')}>
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  )

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden bg-[rgb(var(--quantum-950))]">
      <motion.div className="absolute inset-0 pointer-events-none" transition={{ duration: 0.3 }}>
        <motion.div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 70% 60% at ${mousePos.x}% ${mousePos.y}%, rgb(var(--quantum-500)/.13) 0%, transparent 55%)` }} />
      </motion.div>

      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgb(var(--quantum-500)/.15) 0%, transparent 70%)', filter: 'blur(70px)' }}
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgb(var(--neon-cyan)/.1) 0%, transparent 70%)', filter: 'blur(70px)' }}
        animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,black_40%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex">
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-12">
            <motion.img src="/quark-logo.png" className="w-14 h-auto object-contain"
              style={{ filter: 'drop-shadow(0 0 14px rgb(var(--quantum-500)/.6))' }}
              animate={{ filter: [
                'drop-shadow(0 0 10px rgb(var(--quantum-500)/.5))',
                'drop-shadow(0 0 22px rgb(var(--quantum-500)/.8))',
                'drop-shadow(0 0 10px rgb(var(--quantum-500)/.5))',
              ]}} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
            <div>
              <h1 className="text-2xl font-bold text-white">Quark Tasking</h1>
              <p className="text-xs text-white/30 font-mono tracking-widest">COGNITIVE OS</p>
            </div>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-5xl xl:text-6xl font-light text-white leading-tight mb-6">
            Tu sistema operativo<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--quantum-300))] via-[rgb(var(--neon-cyan))] to-[rgb(var(--quantum-400))]">
              cognitivo del futuro
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg text-white/40 max-w-md mb-12 leading-relaxed">
            La primera plataforma de productividad impulsada por IA que se adapta a tu mente. Privacidad primero.
          </motion.p>

          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
            {[
              { icon: Brain, text: 'Copiloto cognitivo en tiempo real' },
              { icon: Sparkles, text: 'Optimización automática de energía' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgb(var(--quantum-500)/.15)] border border-[rgb(var(--quantum-500)/.2)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[rgb(var(--quantum-300))]" />
                  </div>
                  <span className="text-white/60">{item.text}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25, ease: easeOut }}
                className="relative overflow-hidden rounded-2xl bg-[rgb(var(--quantum-900))] border border-white/[0.08] p-8 shadow-2xl">
                <motion.div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[rgb(var(--quantum-500)/.12)] via-[rgb(var(--neon-cyan)/.06)] to-[rgb(var(--quantum-500)/.12)] opacity-0"
                  animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 4, repeat: Infinity }} />

                <div className="relative">
                  <div className="text-center mb-8">
                    <motion.h3 className="text-2xl font-semibold text-white mb-1.5">
                      {isLogin ? 'Bienvenido de vuelta' : 'Únete a Quark'}
                    </motion.h3>
                    <motion.p className="text-white/40 text-sm">
                      {isLogin ? 'Continúa optimizando tu productividad' : 'Comienza tu transformación cognitiva'}
                    </motion.p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence>
                      {!isLogin && (
                        <motion.div key="reg-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                          <InputField icon={User} label="Nombre de interacción" value={formData.displayName}
                            onChange={set('displayName')} placeholder="Cómo te llamará la IA" required={!isLogin}
                            error={touched.displayName && errors.displayName} autoFocus={!isLogin} />
                          <InputField icon={AtSign} label="@Username" value={formData.username}
                            onChange={set('username')} placeholder="tu_usuario_único" required={!isLogin}
                            error={touched.username && errors.username} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <InputField icon={Mail} label={isLogin ? 'Email o @username' : 'Correo electrónico'}
                      type={isLogin ? 'text' : 'email'} value={formData.email} onChange={set('email')}
                      placeholder={isLogin ? 'tu@email.com o @usuario' : 'tu@email.com'} required
                      error={touched.email && errors.email} autoFocus={isLogin} />

                    <AnimatePresence>
                      {!isLogin && (
                        <motion.div key="phone" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <InputField icon={Phone} label="Teléfono (opcional — para 2FA)" type="tel"
                            value={formData.phone} onChange={set('phone')} placeholder="+34 600 000 000" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <InputField icon={Lock} label="Contraseña" type={showPassword ? 'text' : 'password'}
                      value={formData.password} onChange={set('password')} placeholder="••••••••" required suffix={pwToggle}
                      error={touched.password && errors.password} />

                    {isLogin && (
                      <div className="flex justify-end">
                        <button type="button" className="text-sm text-[rgb(var(--quantum-300))] hover:text-[rgb(var(--quantum-200))] transition-colors">
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                    )}

                    <motion.button type="submit" disabled={isLoading}
                      className="relative w-full py-3.5 rounded-xl bg-gradient-to-r from-[rgb(var(--quantum-500))] to-[rgb(var(--quantum-400))] text-white font-medium flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-60"
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
                      <motion.div className="absolute inset-0 bg-white/10" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.4 }} />
                      {isLoading ? (
                        <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                          <span>{isLogin ? 'Entrando...' : 'Creando cuenta...'}</span>
                        </motion.div>
                      ) : (
                        <>
                          <span>{isLogin ? 'Entrar' : 'Crear cuenta'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-xs text-white/20 font-mono">O</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  <motion.button type="button"
                    className="w-full mb-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.07] hover:border-white/[0.15] transition-all flex items-center justify-center gap-3 text-sm"
                    whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuar con Google
                  </motion.button>

                  <motion.button type="button" onClick={onComplete}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[rgb(var(--neon-cyan)/.12)] to-[rgb(var(--quantum-500)/.12)] border border-[rgb(var(--neon-cyan)/.2)] text-[rgb(var(--neon-cyan))] hover:from-[rgb(var(--neon-cyan)/.2)] hover:to-[rgb(var(--quantum-500)/.2)] transition-all flex items-center justify-center gap-2 text-sm font-medium"
                    whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
                    <img src="/quark-logo.png" className="w-4 h-auto object-contain" alt="" />
                    <span>Entrar ahora mismo</span>
                  </motion.button>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/40">
                      {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                      <button onClick={switchMode} className="text-[rgb(var(--quantum-300))] hover:text-[rgb(var(--quantum-200))] font-medium transition-colors">
                        {isLogin ? 'Crear una' : 'Iniciar sesión'}
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
