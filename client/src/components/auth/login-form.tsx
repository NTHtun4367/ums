import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginFormSchema, type LoginFormValues } from "@/schemas/auth";
import { useLoginMutation } from "@/store/slices/userApi";
import type { RootState } from "@/store";
import { setUserInfo } from "@/store/slices/auth";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  // Initialize Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate("/app", { replace: true });
    }
  }, [navigate, userInfo]);

  // Submit Handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginMutation(data).unwrap();
      dispatch(setUserInfo(response));
      form.reset();
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div>
      <div
        className={cn("flex flex-col gap-6 w-full max-w-4xl", className)}
        {...props}
      >
        <Card className="overflow-hidden p-0 shadow-xl border-zinc-200 dark:border-zinc-800">
          <CardContent className="grid p-0 md:grid-cols-2">
            {/* Form Section */}
            <form
              className="p-6 md:p-12 flex flex-col justify-center"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="gap-6">
                <div className="flex flex-col items-center gap-2 text-center mb-4">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your admin credentials to access the dashboard
                  </p>
                </div>

                {/* Email Field */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="email">Email Address</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          fieldState.invalid &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      />
                      {fieldState.invalid && (
                        <FieldError className="text-destructive text-xs mt-1">
                          {fieldState.error?.message}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Password Field */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="********"
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          fieldState.invalid &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      />
                      {fieldState.invalid && (
                        <FieldError className="text-destructive text-xs mt-1">
                          {fieldState.error?.message}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </FieldGroup>
            </form>

            {/* Image/Decorative Section */}
            <div className="relative hidden bg-muted md:block">
              <img
                src="/placeholder.svg"
                alt="Admin Authentication"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
