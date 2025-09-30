import AppHeader from "@/components/widgets/popup/appHeader";
import Settings from "@/components/widgets/popup/settings";

// type ValidationErrorType =
//   | "required"
//   | "minLength"
//   | "maxLength"
//   | "pattern"
//   | "validate";

// interface ValidationError {
//   type: ValidationErrorType;
//   message: string;
// }

// type FormErrors<T> = Partial<Record<keyof T, ValidationError>>;

// type FormValues = {
//   email: string;
//   password: string;
//   confirmPassword: string;
//   captcha: string;
//   techStack: string[];
//   language: string;
//   fruit: string;
// };

// const myResolver: Resolver<FormValues> = async (values: FormValues) => {
//   const errors: FormErrors<FormValues> = {};
//   if (isEmpty(values.techStack)) {
//     errors.techStack = {
//       type: "required",
//       message: "必填项",
//     };
//   }
//   console.log("values", values);

//   return {
//     values: values,
//     errors: errors,
//   };
// };

function App() {
  // const [defaultValue, setDefaultValue] = useState<string[]>(["react"]);
  // const switchRef = useRef<SwitchRef>(null);
  // const options: SelectOptionConfig[] = [
  //   {
  //     value: "react",
  //     label: "React",
  //   },
  //   {
  //     value: "vue",
  //     label: "Vue.js",
  //     icon: Icons.clock,
  //     style: {
  //       badgeColor: "#0E86F3",
  //       iconColor: "#FCB516",
  //     },
  //   },
  //   {
  //     value: "svelte",
  //     label: "Svelte",
  //     style: {
  //       badgeColor: "#09C2FC",
  //     },
  //   },
  //   { value: "angular", label: "Angular" },
  // ];
  // const languageOptions: SelectGroupConfig[] = [
  //   {
  //     heading: "Aisa",
  //     options: [
  //       {
  //         label: "Chinese",
  //         value: "cn",
  //         icon: Icons.dog,
  //         style: {
  //           badgeColor: "#0E86F3",
  //           iconColor: "#FCB516",
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     heading: "Europe",
  //     options: [
  //       {
  //         label: "English",
  //         value: "en",
  //         icon: Icons.cat,
  //       },
  //     ],
  //   },
  // ];
  // const fruitOptions: RadioOptionConfig[] = [
  //   {
  //     label: "apple",
  //     value: "a",
  //     icon: Icons.clock,
  //   },
  //   {
  //     label: "banana",
  //     value: "b",
  //     icon: Icons.dog,
  //   },
  //   {
  //     label: "cocount",
  //     value: "c",
  //     icon: Icons.cat,
  //   },
  // ];
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   control,
  // } = useForm<FormValues>({
  //   resolver: myResolver,
  //   defaultValues: {
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     captcha: "",
  //     techStack: ["svelte"],
  //     language: "en",
  //     fruit: "b",
  //   },
  // });

  // const onSubmit = (data: FormValues) => {
  //   console.log("data", data);
  // };
  return (
    <div className={`w-[350px] min-h-[600px] p-4 bg-background`}>
      <AppHeader />
      <Settings />
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <label className="block text-sm font-medium mb-1">技术栈</label>
          <Controller
            control={control}
            name="techStack"
            render={({ field }) => {
              return (
                <Select
                  selectType="multiple"
                  singleLine
                  options={options}
                  animationConfig={{
                    badgeAnimation: "slide",
                  }}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              );
            }}
          />
          {!isEmpty(errors.techStack?.message) ? (
            <div className="animate-shake text-red-500 pt-2">
              {errors.techStack?.message}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="mb-1">
          <Label className="block text-sm font-medium mb-1">语言</Label>
          <Controller
            control={control}
            name="language"
            render={({ field }) => {
              return (
                <Select
                  selectType="single"
                  options={languageOptions}
                  variant="destructive"
                  animationConfig={{
                    badgeAnimation: "wiggle",
                  }}
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
              );
            }}
          />
          {!isEmpty(errors.language?.message) ? (
            <div className="animate-shake text-red-500 pt-2">
              {errors.language?.message}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="mb-1">
          <Label className="block text-sm font-medium mb-1">水果</Label>
          <Controller
            control={control}
            name="fruit"
            render={({ field }) => {
              return (
                <Switch
                  options={fruitOptions}
                  variant={"default"}
                  animationConfig={{
                    badgeAnimation: "wiggle",
                  }}
                  switchType={SwitchType.Vertical}
                  defaultValue={field.value}
                  ref={switchRef}
                  onValueChange={field.onChange}
                />
              );
            }}
          ></Controller>
        </div>
        <Button className="mb-1 w-full" type="submit">
          提交
        </Button>
      </form> */}
      {/* <Switch
        options={fruitOptions}
        variant={"default"}
        animationConfig={{
          badgeAnimation: "wiggle",
        }}
        switchType={SwitchType.Vertical}
        defaultValue={fruitOptions[0].value}
        ref={switchRef}
        onValueChange={() => {}}
      /> */}
    </div>
  );
}

export default App;
