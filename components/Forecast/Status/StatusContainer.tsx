export const StatusContainer = ({
	children,
	role,
	ariaLive,
}: {
	children: React.ReactNode;
	role?: string;
	ariaLive?: 'polite' | 'assertive';
}) => (
	<div
		className='flex flex-col items-center justify-center h-64 text-center mt-8'
		role={role}
		aria-live={ariaLive}>
		{children}
	</div>
);
