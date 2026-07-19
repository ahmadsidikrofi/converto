"use client"
import { useState } from "react";
import { motion } from "motion/react";
import { Check, Eye, EyeClosed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// const variables
const CIRCLE_RADIUS = 7;
const CIRCLE_LENGTH = 2 * Math.PI * CIRCLE_RADIUS;

// regex constants
const USERNAME_REGEX = /^[a-zA-Z0-9_]*$/;
const NUMBER_REGEX = /\d/;
const UPPERCASE_REGEX = /[A-Z]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

const getStrokeColorClass = (p) => {
  if (p <= 0) return "stroke-transparent";
  if (p <= 0.35) return "stroke-red-500";
  if (p <= 0.7) return "stroke-orange-500";
  return "stroke-teal-400";
};

// animated checkmark circle component
export const AnimatedCheckmarkCircle = ({
  progress
}) => {
  const isComplete = progress >= 1;

  return (
    <div className="relative flex items-center justify-center w-5 h-5 select-none">
      <svg width="20" height="20" className="-rotate-90">
        <circle
          cx="10"
          cy="10"
          r={CIRCLE_RADIUS}
          className="stroke-white/50"
          strokeWidth="1.5"
          fill="transparent" />
        <motion.circle
          cx="10"
          cy="10"
          r={CIRCLE_RADIUS}
          className={cn("transition-colors duration-300", getStrokeColorClass(progress))}
          strokeWidth="1.5"
          fill="transparent"
          strokeDasharray={CIRCLE_LENGTH}
          initial={{ strokeDashoffset: CIRCLE_LENGTH }}
          animate={{
            strokeDashoffset: CIRCLE_LENGTH - progress * CIRCLE_LENGTH,
          }}
          transition={{
            duration: 0.35,
            ease: "easeInOut",
          }} />
        <motion.circle
          cx="10"
          cy="10"
          r={CIRCLE_RADIUS}
          className="fill-teal-400"
          style={{ transformOrigin: "center" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isComplete ? 1 : 0,
            opacity: isComplete ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: isComplete ? 0.15 : 0,
          }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isComplete ? 1 : 0,
            opacity: isComplete ? 1 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: isComplete ? 0.28 : 0,
          }}>
          <Check className="text-white size-3" strokeWidth={3} />
        </motion.div>
      </div>
    </div>
  );
};

// dry input field component with validation checkmark
const ValidationInputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  progress,
  helperText,
  rightElement,
  error
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "bg-white/10 border-white/10 text-white placeholder:text-slate-200 rounded-xl h-11 focus-visible:ring-1 focus-visible:ring-[#e5322d] focus-visible:border-[#e5322d] transition-colors",
            error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500"
          )} />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {rightElement}
          <AnimatedCheckmarkCircle progress={progress} />
        </div>
      </div>
      {error ? (
        <p className="text-xs text-red-500 pl-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-white px-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

// input component with animated checkmark
const InputWithAnimatedCheckmark = ({
  className,
  email: propEmail,
  setEmail: propSetEmail,
  password: propPassword,
  setPassword: propSetPassword,
  emailError,
  passwordError
}) => {
  const [internalEmail, setInternalEmail] = useState("");
  const [internalPassword, setInternalPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const email = propEmail !== undefined ? propEmail : internalEmail;
  const setEmail = propSetEmail !== undefined ? propSetEmail : setInternalEmail;
  const password = propPassword !== undefined ? propPassword : internalPassword;
  const setPassword = propSetPassword !== undefined ? propSetPassword : setInternalPassword;

  // Calculate email progress based on presence of "@" symbol
  const isEmailValid = email.includes("@");
  const emailProgress = isEmailValid ? 1.0 : 0.0;

  // Password validation checks
  const validations = [
    { text: "Minimal 10 karakter", valid: password.length >= 10 },
    { text: "Mengandung angka", valid: NUMBER_REGEX.test(password) },
    { text: "Mengandung huruf besar", valid: UPPERCASE_REGEX.test(password) },
    {
      text: "Mengandung karakter unik",
      valid: SPECIAL_CHAR_REGEX.test(password),
    },
  ];

  const satisfiedCount = validations.filter((v) => v.valid).length;
  const passwordProgress = satisfiedCount / validations.length;

  return (
    <div className={cn("w-full max-w-xl space-y-4", className)}>
      <div className="space-y-4">
        {/* Email Field */}
        <ValidationInputField
          id="email-input"
          label="Email"
          type="email"
          placeholder="Masukkan alamat email"
          value={email}
          onChange={setEmail}
          progress={emailProgress}
          helperText="Harus mengandung simbol @"
          error={emailError} />

        {/* Password Field */}
        <ValidationInputField
          id="password-input"
          label="Kata Sandi"
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={setPassword}
          progress={passwordProgress}
          error={passwordError}
          rightElement={
            <Button
              type="button"
              className="h-7 w-7 text-white hover:text-white/80 cursor-pointer hover:bg-transparent"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Eye className="size-4" />
              ) : (
                <EyeClosed className="size-4" />
              )}
            </Button>
          } />

        {/* Real-time Checklist */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-medium text-white">
            Kata sandi harus terdiri dari:
          </span>
          <div className="space-y-1.5">
            {validations.map((validation, index) => (
              <div
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors duration-200",
                  validation.valid
                    ? "text-teal-400 font-medium"
                    : "text-white"
                )}
                key={index}>
                <div className="flex items-center justify-center w-3.5 h-3.5">
                  {validation.valid ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center w-3 h-3 rounded-full bg-teal-400 text-white">
                      <Check className="size-2.5 shrink-0" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/60" />
                  )}
                </div>
                <span className="text-sm">{validation.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputWithAnimatedCheckmark;
