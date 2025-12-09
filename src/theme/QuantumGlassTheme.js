/**
 * Quantum Glassmorphism Theme - Healthcare Edition (Enhanced)
 * 
 * Quantum Visual Parameters:
 * - Superposition: Multiple blur layers create quantum superposition effect
 * - Entanglement: Color interactions across healthcare spectrum
 * - Wave Function: Smooth transitions between opacity states
 * - Uncertainty Principle: Micro-interactions reveal depth
 * - Observation Effect: Hover states collapse to specific states
 * 
 * Healthcare Color System (7 Clinical States):
 * 1. Critical (Root):        #DC2626 - Emergency Alert Red
 * 2. Warning (Sacral):       #EA580C - High Priority Orange
 * 3. Caution (Solar):        #FACC15 - Moderate Alert Yellow
 * 4. Normal (Heart):         #10B981 - Healthy Status Green
 * 5. Info (Throat):          #0EA5E9 - Information Blue
 * 6. Insight (Third Eye):    #8B5CF6 - Analytics/Diagnosis Purple
 * 7. Care (Crown):           #EC4899 - Compassion/Wellness Pink
 * 
 * WCAG AAA Compliance + Ultra-Deep Transparency + Color-Hued Edges
 */

import React, { useEffect, useRef } from 'react';

// ============================================================================
// QUANTUM PARAMETERS - Core Visual Properties
// ============================================================================

export const QuantumParams = {
  // Depth Layers - Create quantum superposition through layering
  blur: {
    quantum: 'backdrop-blur-3xl',      // 48px - Deep quantum tunnel
    deep: 'backdrop-blur-2xl',         // 40px - Entangled state
    medium: 'backdrop-blur-xl',        // 20px - Observable reality
    light: 'backdrop-blur-lg',         // 12px - Surface level
    minimal: 'backdrop-blur-md',       // 8px - Initial observation
    stack: 'backdrop-blur-3xl',        // Stacked blur for enhanced depth
  },

  // Transparency Spectrum - Wave function collapse (ENHANCED: More vibrant with color showing)
  opacity: {
    crystal: 'bg-white/1 dark:bg-black/1',      // 1% - Crystal clear (shows color through)
    ultraClear: 'bg-white/2 dark:bg-black/2',   // 2% - Ultra transparent (color visible)
    quantum: 'bg-white/5 dark:bg-black/5',      // 5% - Pure superposition
    ethereal: 'bg-white/8 dark:bg-black/8',     // 8% - Near-transparent
    veil: 'bg-white/12 dark:bg-black/12',       // 12% - Semi-transparent
    mist: 'bg-white/15 dark:bg-black/15',       // 15% - Visible mist
    fog: 'bg-white/20 dark:bg-black/20',        // 20% - Deep fog
    haze: 'bg-white/25 dark:bg-black/25',       // 25% - Moderate haze
    cloud: 'bg-white/30 dark:bg-black/30',      // 30% - Cloud-like
    dense: 'bg-white/40 dark:bg-black/40',      // 40% - Dense glass
  },

  // Border Transparency - Quantum boundary states
  border: {
    quantum: 'border-white/5 dark:border-white/3',
    ethereal: 'border-white/10 dark:border-white/5',
    veil: 'border-white/15 dark:border-white/8',
    mist: 'border-white/20 dark:border-white/12',
    fog: 'border-white/30 dark:border-white/20',
    clear: 'border-white/40 dark:border-white/30',
  },

  // Edge Halos - NEON Color-shifted borders with quantum glow (VIBRANT)
  edgeHalo: {
    critical: 'shadow-[0_0_30px_rgba(255,0,85,0.7),0_0_60px_rgba(255,0,85,0.4),inset_0_0_20px_rgba(255,0,85,0.2)]',
    warning: 'shadow-[0_0_30px_rgba(255,102,0,0.7),0_0_60px_rgba(255,102,0,0.4),inset_0_0_20px_rgba(255,102,0,0.2)]',
    caution: 'shadow-[0_0_30px_rgba(255,255,0,0.7),0_0_60px_rgba(255,255,0,0.4),inset_0_0_20px_rgba(255,255,0,0.2)]',
    normal: 'shadow-[0_0_30px_rgba(0,255,136,0.7),0_0_60px_rgba(0,255,136,0.4),inset_0_0_20px_rgba(0,255,136,0.2)]',
    info: 'shadow-[0_0_30px_rgba(0,187,255,0.7),0_0_60px_rgba(0,187,255,0.4),inset_0_0_20px_rgba(0,187,255,0.2)]',
    insight: 'shadow-[0_0_30px_rgba(170,76,255,0.7),0_0_60px_rgba(170,76,255,0.4),inset_0_0_20px_rgba(170,76,255,0.2)]',
    care: 'shadow-[0_0_30px_rgba(255,0,170,0.7),0_0_60px_rgba(255,0,170,0.4),inset_0_0_20px_rgba(255,0,170,0.2)]',
  },

  // NEON Healthcare Color States - Vibrant clinical mappings with enhanced glow
  chakra: {
    critical: {
      bg: 'bg-red-600/30',
      text: 'text-red-400 dark:text-red-200',
      border: 'border-red-500/60',
      glow: 'from-red-500/50 to-red-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-red-500/80 from-red-500/40',
      neonGlow: 'glow-red-500',
      hex: '#FF0055',
    },
    warning: {
      bg: 'bg-orange-600/30',
      text: 'text-orange-400 dark:text-orange-200',
      border: 'border-orange-500/60',
      glow: 'from-orange-500/50 to-orange-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-orange-500/80 from-orange-500/40',
      neonGlow: 'glow-orange-500',
      hex: '#FF6600',
    },
    caution: {
      bg: 'bg-yellow-500/30',
      text: 'text-yellow-300 dark:text-yellow-200',
      border: 'border-yellow-400/60',
      glow: 'from-yellow-400/50 to-yellow-300/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-yellow-400/80 from-yellow-400/40',
      neonGlow: 'glow-yellow-400',
      hex: '#FFFF00',
    },
    normal: {
      bg: 'bg-emerald-500/30',
      text: 'text-emerald-300 dark:text-emerald-200',
      border: 'border-emerald-400/60',
      glow: 'from-emerald-400/50 to-emerald-300/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-emerald-400/80 from-emerald-400/40',
      neonGlow: 'glow-emerald-400',
      hex: '#00FF88',
    },
    info: {
      bg: 'bg-cyan-500/30',
      text: 'text-cyan-300 dark:text-cyan-200',
      border: 'border-cyan-400/60',
      glow: 'from-cyan-400/50 to-cyan-300/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-cyan-400/80 from-cyan-400/40',
      neonGlow: 'glow-cyan-400',
      hex: '#00BBFF',
    },
    insight: {
      bg: 'bg-violet-600/30',
      text: 'text-violet-300 dark:text-violet-200',
      border: 'border-violet-500/60',
      glow: 'from-violet-500/50 to-violet-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-violet-500/80 from-violet-500/40',
      neonGlow: 'glow-violet-500',
      hex: '#AA4CFF',
    },
    care: {
      bg: 'bg-pink-600/30',
      text: 'text-pink-300 dark:text-pink-200',
      border: 'border-pink-500/60',
      glow: 'from-pink-500/50 to-pink-400/20',
      edgeBorder: 'border-transparent',
      edgeGradient: 'to-pink-500/80 from-pink-500/40',
      neonGlow: 'glow-pink-500',
      hex: '#FF00AA',
    },
  },

  // Transition Curves - Quantum wave function
  transition: {
    quantum: 'transition-all duration-500 ease-in-out',    // Smooth superposition
    entangled: 'transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)',
    observing: 'transition-all duration-200 ease-out',     // Quick observation
    collapsing: 'transition-all duration-150 ease-in',     // Wave collapse
  },

  // Shadow Layers - Quantum depth
  shadow: {
    quantum: 'shadow-2xl dark:shadow-2xl/50',
    deep: 'shadow-xl dark:shadow-xl/40',
    medium: 'shadow-lg dark:shadow-lg/30',
    light: 'shadow-sm dark:shadow-sm/20',
  },
};

// ============================================================================
// QUANTUM CARD - Ultra-Transparent with Color-Hued Edges
// ============================================================================

export const QuantumCard = ({
  children,
  chakra = 'normal',
  blurLevel = 'medium',
  opacityLevel = 'ultraClear',
  glow = true,
  interactive = true,
  edgeGlow = true,
  role = 'article',
  ariaLabel,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra] || QuantumParams.chakra.normal;
  const blurClass = QuantumParams.blur[blurLevel];
  const opacityClass = QuantumParams.opacity[opacityLevel];
  const borderClass = QuantumParams.border[blurLevel === 'quantum' ? 'quantum' : 'mist'];
  const shadowClass = QuantumParams.shadow[blurLevel === 'quantum' ? 'quantum' : 'deep'];
  const transitionClass = QuantumParams.transition.quantum;
  const edgeHaloClass = QuantumParams.edgeHalo[chakra] || QuantumParams.edgeHalo.normal;

  return (
    <div
      className={`
        relative
        group
        ${blurClass}
        ${opacityClass}
        ${chakraConfig.bg}
        rounded-2xl
        border
        ${borderClass}
        ${chakraConfig.border}
        p-5
        ${shadowClass}
        ${edgeGlow ? edgeHaloClass : ''}
        ${interactive ? 'cursor-pointer hover:shadow-2xl dark:hover:shadow-2xl/60' : ''}
        ${interactive ? 'hover:' + opacityClass.replace('bg-white/', 'bg-white/') : ''}
        ${transitionClass}
        ${glow ? 'before:absolute before:inset-0 before:rounded-2xl before:opacity-0 group-hover:before:opacity-100 before:' + chakraConfig.glow.split(' ')[0] + ' before:pointer-events-none before:transition-opacity before:duration-300' : ''}
        ${interactive ? 'hover:-translate-y-1' : ''}
        ${className}
      `}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {/* Edge Gradient Overlay - Color-hued border effect */}
      {edgeGlow && (
        <div className={`
          absolute
          inset-0
          rounded-2xl
          border
          border-2
          ${chakraConfig.edgeBorder}
          opacity-0
          group-hover:opacity-100
          ${transitionClass}
          pointer-events-none
          bg-gradient-to-br
          ${chakraConfig.edgeGradient}
          -z-10
        `} />
      )}

      <div className="relative z-10">
        {children}
      </div>
      
      {/* Quantum Gradient Underlay */}
      {glow && (
        <div className={`
          absolute
          inset-0
          rounded-2xl
          bg-gradient-to-br
          ${chakraConfig.glow}
          opacity-0
          group-hover:opacity-40
          ${transitionClass}
          pointer-events-none
          -z-10
        `} />
      )}
    </div>
  );
};

// ============================================================================
// QUANTUM GLASS PANEL - Ultra-Clear with Color-Shifted Edges
// ============================================================================

export const QuantumGlassPanel = ({
  children,
  chakra = 'info',
  depth = 'deep',
  className = '',
  edgeGlow = true,
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];
  const edgeHaloClass = QuantumParams.edgeHalo[chakra] || QuantumParams.edgeHalo.info;
  const depthConfig = {
    quantum: { blur: 'quantum', opacity: 'ultraClear', border: 'quantum' },
    deep: { blur: 'deep', opacity: 'crystal', border: 'ethereal' },
    medium: { blur: 'medium', opacity: 'ultraClear', border: 'veil' },
    light: { blur: 'light', opacity: 'quantum', border: 'mist' },
  }[depth];

  return (
    <div className={`
      relative
      group
      overflow-hidden
      rounded-3xl
      ${edgeGlow ? edgeHaloClass : ''}
      ${className}
    `}>
      {/* Layer 1: Quantum Base - Ultra-transparent */}
      <div className={`
        absolute
        inset-0
        ${QuantumParams.blur[depthConfig.blur]}
        ${QuantumParams.opacity[depthConfig.opacity]}
        ${chakraConfig.bg}
      `} />

      {/* Layer 2: Quantum Entanglement - Enhanced depth */}
      <div className={`
        absolute
        inset-0
        backdrop-blur-3xl
        ${QuantumParams.opacity.quantum}
        from-transparent to-white/5 dark:to-black/5
        bg-gradient-to-br
      `} />

      {/* Layer 3: Border Quantum State with Color Hue */}
      <div className={`
        absolute
        inset-0
        rounded-3xl
        border-2
        ${QuantumParams.border[depthConfig.border]}
        ${chakraConfig.border}
        pointer-events-none
        opacity-0
        group-hover:opacity-100
        ${QuantumParams.transition.quantum}
        bg-gradient-to-br
        ${chakraConfig.edgeGradient}
      `} />

      {/* Standard Border */}
      <div className={`
        absolute
        inset-0
        rounded-3xl
        border
        ${QuantumParams.border[depthConfig.border]}
        ${chakraConfig.border}
        pointer-events-none
      `} />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>

      {/* Enhanced Glow Effect Layer */}
      <div className={`
        absolute
        -inset-1
        rounded-3xl
        bg-gradient-to-br
        ${chakraConfig.glow}
        opacity-10
        group-hover:opacity-30
        blur-2xl
        -z-10
        ${QuantumParams.transition.quantum}
      `} />
    </div>
  );
};

// ============================================================================
// QUANTUM ENERGY BUTTON - Chakra-Powered Interactive Element
// ============================================================================

export const QuantumEnergyButton = ({
  children,
  chakra = 'throat',
  size = 'md',
  variant = 'glass',
  icon,
  ariaLabel,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];
  const sizeConfig = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }[size];

  const variantClasses = {
    glass: `
      ${QuantumParams.blur.light}
      ${QuantumParams.opacity.fog}
      ${chakraConfig.bg}
      border
      ${QuantumParams.border.fog}
      ${chakraConfig.border}
      hover:${QuantumParams.opacity.cloud}
      hover:${QuantumParams.blur.medium}
    `,
    solid: `
      bg-gradient-to-br
      ${chakraConfig.glow}
      border
      ${chakraConfig.border}
    `,
    outline: `
      ${QuantumParams.opacity.ethereal}
      border-2
      ${chakraConfig.border}
      ${chakraConfig.text}
    `,
  }[variant];

  return (
    <button
      className={`
        relative
        group
        ${sizeConfig}
        rounded-xl
        font-semibold
        ${chakraConfig.text}
        ${variantClasses}
        ${QuantumParams.transition.observing}
        hover:shadow-2xl dark:hover:shadow-2xl/50
        hover:-translate-y-1
        active:translate-y-0
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-offset-white dark:focus:ring-offset-gray-950
        ${chakraConfig.border}
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="flex items-center justify-center gap-2 relative z-10">
        {icon && <span aria-hidden="true" className="text-lg">{icon}</span>}
        <span>{children}</span>
      </div>

      {/* Quantum Glow Effect */}
      <div className={`
        absolute
        inset-0
        rounded-xl
        bg-gradient-to-br
        ${chakraConfig.glow}
        opacity-0
        group-hover:opacity-30
        group-active:opacity-20
        ${QuantumParams.transition.quantum}
        pointer-events-none
        -z-10
      `} />
    </button>
  );
};

// ============================================================================
// QUANTUM HEALTH METRIC - Healthcare-Specific Data Display
// ============================================================================

export const QuantumHealthMetric = ({
  label,
  value,
  unit = '',
  icon,
  chakra = 'heart',
  status = 'normal',
  normalRange = null,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];
  const statusColors = {
    critical: 'text-red-600 dark:text-red-400',
    warning: 'text-orange-600 dark:text-orange-400',
    caution: 'text-yellow-600 dark:text-yellow-400',
    normal: 'text-emerald-600 dark:text-emerald-400',
  };

  return (
    <QuantumCard
      chakra={chakra}
      blurLevel="medium"
      opacityLevel="cloud"
      className={`
        flex
        flex-col
        justify-between
        min-h-32
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <dt className={`text-sm font-medium ${chakraConfig.text}`}>
          {label}
        </dt>
        {icon && <span className="text-2xl" aria-hidden="true">{icon}</span>}
      </div>

      <div>
        <dd className={`
          text-3xl
          font-black
          ${chakraConfig.text}
          mb-1
        `}>
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </dd>
        <div className="flex items-center justify-between">
          <span className={`
            text-xs
            font-semibold
            px-2
            py-1
            rounded
            ${statusColors[status]}
            bg-current/10
          `}>
            {status.toUpperCase()}
          </span>
          {normalRange && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {normalRange}
            </span>
          )}
        </div>
      </div>
    </QuantumCard>
  );
};

// ============================================================================
// QUANTUM CHAKRA SPECTRUM - 7-Chakra Color Gradient Strip
// ============================================================================

export const QuantumChakraSpectrum = ({
  className = '',
  interactive = false,
  onChakraSelect,
  ...props
}) => {
  const chakras = Object.entries(QuantumParams.chakra).map(([key, value]) => ({
    name: key,
    ...value,
  }));

  return (
    <div
      className={`
        flex
        gap-1
        ${QuantumParams.blur.medium}
        ${QuantumParams.opacity.fog}
        rounded-2xl
        p-2
        border
        ${QuantumParams.border.mist}
        ${className}
      `}
      {...props}
    >
      {chakras.map(({ name, hex }) => (
        <button
          key={name}
          onClick={() => onChakraSelect?.(name)}
          className={`
            flex-1
            h-12
            rounded-lg
            transition-all
            duration-300
            cursor-pointer
            hover:shadow-lg
            hover:scale-105
            active:scale-95
            focus:outline-none
            focus:ring-2
            focus:ring-offset-1
            focus:ring-offset-white dark:focus:ring-offset-gray-950
          `}
          style={{
            backgroundColor: hex,
            opacity: 0.7,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
          aria-label={`Select ${name} chakra`}
          title={`${name.replace('_', ' ').toUpperCase()}`}
        />
      ))}
    </div>
  );
};

// ============================================================================
// QUANTUM GLASS GRID - Multi-Chakra Responsive Layout
// ============================================================================

export const QuantumGlassGrid = ({
  children,
  columns = 3,
  gap = 5,
  chakras = true,
  className = '',
  ...props
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  const gapClasses = {
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div
      className={`
        grid
        ${colClasses[columns]}
        ${gapClasses[gap]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// QUANTUM MODAL - Deep Glass Overlay
// ============================================================================

export const QuantumModal = ({
  children,
  isOpen,
  onClose,
  chakra = 'crown',
  size = 'md',
  ariaLabel,
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }[size];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - Quantum Blur */}
      <div
        className={`
          absolute
          inset-0
          ${QuantumParams.blur.quantum}
          ${QuantumParams.opacity.fog}
          bg-black/30 dark:bg-black/50
          cursor-pointer
          ${QuantumParams.transition.quantum}
        `}
        onClick={onClose}
        role="presentation"
        aria-hidden="true"
      />

      {/* Modal Panel - Deep Quantum Glass */}
      <QuantumGlassPanel
        chakra={chakra}
        depth="deep"
        className={`
          relative
          z-10
          w-full
          ${sizeClasses}
          ${QuantumParams.shadow.quantum}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        {...props}
      >
        <button
          onClick={onClose}
          className={`
            absolute
            top-4
            right-4
            z-20
            text-2xl
            ${chakraConfig.text}
            hover:opacity-60
            transition-opacity
            duration-200
            focus:outline-none
            focus:ring-2
            ${chakraConfig.border}
          `}
          aria-label="Close modal"
        >
          ✕
        </button>

        {children}
      </QuantumGlassPanel>
    </div>
  );
};

// ============================================================================
// QUANTUM SECTION - Full-Width Energy Band
// ============================================================================

export const QuantumSection = ({
  children,
  chakra = 'heart',
  className = '',
  ...props
}) => {
  const chakraConfig = QuantumParams.chakra[chakra];

  return (
    <section
      className={`
        w-full
        py-12
        px-6
        relative
        overflow-hidden
        ${QuantumParams.blur.medium}
        ${QuantumParams.opacity.mist}
        ${chakraConfig.bg}
        border-y
        ${QuantumParams.border.mist}
        ${chakraConfig.border}
        ${QuantumParams.shadow.medium}
        bg-gradient-to-br
        from-transparent
        to-transparent
        ${className}
      `}
      {...props}
    >
      {/* Background Glow */}
      <div className={`
        absolute
        inset-0
        bg-gradient-to-br
        ${chakraConfig.glow}
        opacity-20
        blur-3xl
        pointer-events-none
        -z-10
      `} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

// ============================================================================
// EXPORT - Quantum Theme Package (Healthcare)
// ============================================================================

const QuantumGlassTheme = {
  QuantumParams,
  QuantumCard,
  QuantumGlassPanel,
  QuantumEnergyButton,
  QuantumHealthMetric,
  QuantumChakraSpectrum,
  QuantumGlassGrid,
  QuantumModal,
  QuantumSection,
};

export default QuantumGlassTheme;
