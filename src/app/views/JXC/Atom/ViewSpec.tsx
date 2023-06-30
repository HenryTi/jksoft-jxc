import { useUqApp } from "app/UqApp";

// name or phrase of spec
export function ViewSpec({ name, className, value }: { name: string; className?: string; value: any; }) {
    const uqApp = useUqApp();
    const { View } = uqApp.gSpecs[name];
    return <View className={className} value={value} />;
}