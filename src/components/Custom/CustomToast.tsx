import { toast } from "sonner";
import {
	CheckCircle2,
	XCircle,
	AlertTriangle,
	Info,
	Bell,
} from "lucide-react";

export type ToastMode = "success" | "error" | "warning" | "info";

export interface CustomToastOptions {
	description?: string;
	duration?: number;
}

const ICONS: Record<ToastMode, { icon: typeof Bell; className: string }> = {
	success: { icon: CheckCircle2, className: "text-green-500" },
	error: { icon: XCircle, className: "text-destructive" },
	warning: { icon: AlertTriangle, className: "text-amber-500" },
	info: { icon: Info, className: "text-primary" },
};

const DEFAULT_OPTIONS: CustomToastOptions = {
	duration: 4000,
};

function resolveOptions(
	options?: CustomToastOptions | string,
): CustomToastOptions {
	const resolved =
		typeof options === "string" ? { description: options } : options;
	return { ...DEFAULT_OPTIONS, ...resolved };
}

function buildToastOptions(mode: ToastMode, options?: CustomToastOptions) {
	const { description, duration } = resolveOptions(options);
	const { icon: Icon, className } = ICONS[mode];
	return {
		description,
		duration,
		icon: <Icon className={`h-5 w-5 shrink-0 ${className}`} />,
	};
}

function showToast(
	message: string,
	mode?: ToastMode,
	options?: CustomToastOptions,
) {
	const toastOptions = mode
		? buildToastOptions(mode, options)
		: resolveOptions(options);

	switch (mode) {
		case "success":
			return toast.success(message, toastOptions);
		case "error":
			return toast.error(message, toastOptions);
		case "warning":
			return toast.warning(message, toastOptions);
		case "info":
			return toast.info(message, toastOptions);
		default: {
			const { description, duration } =
				toastOptions as CustomToastOptions;
			return toast(message, {
				description,
				duration,
				icon: <Bell className="h-5 w-5 shrink-0 text-muted-foreground" />,
			});
		}
	}
}

function CustomToast(
	message: string,
	mode?: ToastMode,
	options?: CustomToastOptions,
) {
	return showToast(message, mode, options);
}

CustomToast.success = (message: string, options?: CustomToastOptions) =>
	showToast(message, "success", options);
CustomToast.error = (message: string, options?: CustomToastOptions) =>
	showToast(message, "error", options);
CustomToast.warning = (message: string, options?: CustomToastOptions) =>
	showToast(message, "warning", options);
CustomToast.info = (message: string, options?: CustomToastOptions) =>
	showToast(message, "info", options);

export default CustomToast;
