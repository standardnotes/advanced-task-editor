type RoundButtonProps = {
  testId?: string
  onClick: () => void
}

export const RoundButton: React.FC<RoundButtonProps> = ({
  testId,
  onClick,
  children,
}) => {
  return (
    <button
      data-testid={testId}
      className="sn-icon-button border-contrast"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
