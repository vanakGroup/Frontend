import { CustomCheckBox } from "@/components/Custom/CustomCheckBox";
import CustomInput from "@/components/Custom/CustomInput";
import { CustomLabel } from "@/components/Custom/CustomLabel";
import { useState } from "react";
import { Search, Mail, Lock, User } from "lucide-react";

export default function ComponentTest() {
  const [defaultChecked, setDefaultChecked] = useState<boolean>(false);
  const [primaryChecked, setPrimaryChecked] = useState<boolean>(false);
  const [secondaryChecked, setSecondaryChecked] = useState<boolean>(false);
  const [accentChecked, setAccentChecked] = useState<boolean>(false);
  const [disabledChecked, setDisabledChecked] = useState<boolean>(true);

  const [searchValue, setSearchValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [errorInput, setErrorInput] = useState<string>("");
  const [rtlInput, setRtlInput] = useState<string>("");

  return (
    <div className="p-8 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CustomCheckBox Variants</h1>

      {/* Default Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Default Variant</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomCheckBox.Root variant="default" defaultChecked={false}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Unchecked default checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="default" defaultChecked={true}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Checked default checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root
            variant="default"
            checked={defaultChecked}
            onCheckedChange={setDefaultChecked}
          >
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Controlled default checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>
        </div>
      </section>

      {/* Primary Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Primary Variant</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomCheckBox.Root variant="primary" defaultChecked={false}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Unchecked primary checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="primary" defaultChecked={true}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Checked primary checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root
            variant="primary"
            checked={primaryChecked}
            onCheckedChange={setPrimaryChecked}
          >
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Controlled primary checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>
        </div>
      </section>

      {/* Secondary Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Secondary Variant</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomCheckBox.Root variant="secondary" defaultChecked={false}>
        <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Unchecked secondary checkbox</CustomCheckBox.Label>
      </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="secondary" defaultChecked={true}>
        <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Checked secondary checkbox</CustomCheckBox.Label>
      </CustomCheckBox.Root>

          <CustomCheckBox.Root
            variant="secondary"
            checked={secondaryChecked}
            onCheckedChange={setSecondaryChecked}
          >
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Controlled secondary checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>
        </div>
      </section>

      {/* Accent Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Accent Variant</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomCheckBox.Root variant="accent" defaultChecked={false}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Unchecked accent checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="accent" defaultChecked={true}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Checked accent checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root
            variant="accent"
            checked={accentChecked}
            onCheckedChange={setAccentChecked}
          >
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Controlled accent checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>
        </div>
      </section>

      {/* Disabled States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Disabled States</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomCheckBox.Root variant="default" disabled defaultChecked={false}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Disabled unchecked</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root
            variant="default"
            disabled
            checked={disabledChecked}
            onCheckedChange={setDisabledChecked}
          >
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Disabled checked</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="primary" disabled defaultChecked={true}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Disabled primary</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="secondary" disabled defaultChecked={true}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Disabled secondary</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="accent" disabled defaultChecked={true}>
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Disabled accent</CustomCheckBox.Label>
          </CustomCheckBox.Root>
        </div>
      </section>

      {/* CustomInput Section */}
      <h1 className="text-3xl font-bold mb-6 mt-12">CustomInput Variants</h1>

      {/* Basic Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Usage</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput
            label="Default Input"
            placeholder="Enter text..."
            variant="default"
          />

          <CustomInput
            label="With Value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Controlled input..."
            variant="default"
          />
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Variants</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput
            label="Default Variant"
            placeholder="Default input..."
            variant="default"
          />

          <CustomInput
            label="Primary Variant"
            placeholder="Primary input..."
            variant="primary"
          />

          <CustomInput
            label="Secondary Variant"
            placeholder="Secondary input..."
            variant="secondary"
          />

          <CustomInput
            label="Accent Variant"
            placeholder="Accent input..."
            variant="accent"
          />

          <CustomInput
            label="Error Variant"
            placeholder="Error input..."
            variant="error"
          />
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Sizes</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput
            label="Small Size"
            placeholder="Small input..."
            inputSize="sm"
          />

          <CustomInput
            label="Medium Size (Default)"
            placeholder="Medium input..."
            inputSize="md"
          />

          <CustomInput
            label="Large Size"
            placeholder="Large input..."
            inputSize="lg"
          />
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">With Icons</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput
            label="Search (Left Icon)"
            placeholder="Search..."
            icon={<Search size={18} />}
            iconPosition="left"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <CustomInput
            label="Email (Left Icon)"
            type="email"
            placeholder="email@example.com"
            icon={<Mail size={18} />}
            iconPosition="left"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
          />

          <CustomInput
            label="Password (Right Icon)"
            type="password"
            placeholder="Enter password..."
            icon={<Lock size={18} />}
            iconPosition="right"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />

          <CustomInput
            label="Username (Right Icon)"
            placeholder="Enter username..."
            icon={<User size={18} />}
            iconPosition="right"
            value={usernameValue}
            onChange={(e) => setUsernameValue(e.target.value)}
          />
        </div>
      </section>

      {/* Error States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Error States</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput
            label="With Error Message"
            placeholder="Enter email..."
            error="This field is required"
            value={errorInput}
            onChange={(e) => setErrorInput(e.target.value)}
          />

          <CustomInput
            label="Error Variant with Message"
            placeholder="Invalid input..."
            variant="error"
            error="Please enter a valid email address"
          />
        </div>
      </section>

      {/* RTL Support */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">RTL Support</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput
            label="ورودی فارسی"
            placeholder="متن خود را وارد کنید..."
            dir="rtl"
            value={rtlInput}
            onChange={(e) => setRtlInput(e.target.value)}
          />

          <CustomInput
            label="با آیکون"
            placeholder="جستجو..."
            dir="rtl"
            icon={<Search size={18} />}
            iconPosition="left"
          />
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Disabled State</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput
            label="Disabled Input"
            placeholder="Cannot edit..."
            disabled
            value="Disabled value"
          />

          <CustomInput
            label="Disabled with Icon"
            placeholder="Cannot edit..."
            disabled
            icon={<Mail size={18} />}
            iconPosition="left"
          />
        </div>
      </section>

      {/* CustomLabel Variants */}
      <h1 className="text-3xl font-bold mb-6 mt-12">CustomLabel Component</h1>

      {/* Variant Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Standalone Label Variants</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="space-y-2">
            <CustomLabel variant="default">Default Label</CustomLabel>
            <CustomInput placeholder="Enter text..." />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="primary">Primary Label</CustomLabel>
            <CustomInput placeholder="Enter text..." />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="secondary">Secondary Label</CustomLabel>
            <CustomInput placeholder="Enter text..." />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="muted">Muted Label</CustomLabel>
            <CustomInput placeholder="Enter text..." />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="accent">Accent Label</CustomLabel>
            <CustomInput placeholder="Enter text..." />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="destructive">Destructive Label</CustomLabel>
            <CustomInput placeholder="Enter text..." variant="error" />
          </div>
        </div>
      </section>

      {/* Size Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Label Sizes</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="space-y-2">
            <CustomLabel size="sm">Small Label</CustomLabel>
            <CustomInput placeholder="Small size..." />
          </div>

          <div className="space-y-2">
            <CustomLabel size="default">Default Label</CustomLabel>
            <CustomInput placeholder="Default size..." />
          </div>

          <div className="space-y-2">
            <CustomLabel size="lg">Large Label</CustomLabel>
            <CustomInput placeholder="Large size..." />
          </div>

          <div className="space-y-2">
            <CustomLabel size="xl">Extra Large Label</CustomLabel>
            <CustomInput placeholder="Extra large size..." />
          </div>
        </div>
      </section>

      {/* Weight Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Label Weights</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="space-y-2">
            <CustomLabel weight="normal">Normal Weight</CustomLabel>
            <CustomInput placeholder="Normal weight..." />
          </div>

          <div className="space-y-2">
            <CustomLabel weight="medium">Medium Weight</CustomLabel>
            <CustomInput placeholder="Medium weight..." />
          </div>

          <div className="space-y-2">
            <CustomLabel weight="semibold">Semibold Weight</CustomLabel>
            <CustomInput placeholder="Semibold weight..." />
          </div>

          <div className="space-y-2">
            <CustomLabel weight="bold">Bold Weight</CustomLabel>
            <CustomInput placeholder="Bold weight..." />
          </div>
        </div>
      </section>

      {/* Required Labels */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Required Labels</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="space-y-2">
            <CustomLabel required>Required Field</CustomLabel>
            <CustomInput placeholder="This field is required..." />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="primary" required>Email Address</CustomLabel>
            <CustomInput placeholder="email@example.com" icon={<Mail size={18} />} iconPosition="left" />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="accent" size="lg" weight="bold" required>Password</CustomLabel>
            <CustomInput type="password" placeholder="Enter password..." icon={<Lock size={18} />} iconPosition="left" />
          </div>
        </div>
      </section>

      {/* Combined Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Combined Variants</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="space-y-2">
            <CustomLabel variant="primary" size="lg" weight="bold">Username</CustomLabel>
            <CustomInput placeholder="Enter username..." icon={<User size={18} />} iconPosition="left" />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="accent" size="sm" weight="normal">Optional Note</CustomLabel>
            <CustomInput placeholder="Add a note..." />
          </div>

          <div className="space-y-2">
            <CustomLabel variant="muted" size="default" weight="medium">Search Query</CustomLabel>
            <CustomInput placeholder="Search..." icon={<Search size={18} />} iconPosition="left" />
          </div>
        </div>
      </section>

      {/* CustomInput with Label Props */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">CustomInput with Label Variants</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomInput label="Default Label" placeholder="Enter text...">
            <CustomInput.Label>Default Label</CustomInput.Label>
            <CustomInput.Input />
          </CustomInput>

          <CustomInput label="Primary Label" placeholder="Enter text...">
            <CustomInput.Label variant="primary" size="lg">Primary Label</CustomInput.Label>
            <CustomInput.Input />
          </CustomInput>

          <CustomInput label="Required Field" placeholder="Enter text...">
            <CustomInput.Label variant="accent" weight="bold" required>Required Field</CustomInput.Label>
            <CustomInput.Input />
          </CustomInput>

          <CustomInput label="Muted Small" placeholder="Enter text...">
            <CustomInput.Label variant="muted" size="sm" weight="normal">Muted Small Label</CustomInput.Label>
            <CustomInput.Input />
          </CustomInput>
        </div>
      </section>

      {/* CustomCheckBox with Label Props */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">CustomCheckBox with Label Variants</h2>
        <div className="space-y-3 p-4 border rounded-lg">
          <CustomCheckBox.Root variant="default">
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label>Default checkbox label</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="primary">
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label size="lg" weight="bold">Large bold primary label</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="accent">
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label variant="accent" required>Required accent checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="secondary">
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label size="sm" weight="normal">Small secondary label</CustomCheckBox.Label>
          </CustomCheckBox.Root>

          <CustomCheckBox.Root variant="primary">
            <CustomCheckBox.Checkbox />
            <CustomCheckBox.Label variant="destructive" size="lg">Custom destructive label on primary checkbox</CustomCheckBox.Label>
          </CustomCheckBox.Root>
        </div>
      </section>
    </div>
  );
}
