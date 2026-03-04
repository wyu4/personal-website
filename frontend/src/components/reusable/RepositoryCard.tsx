import { forwardRef } from "react";
import { limitText } from "../../utils/TextUtils";

const Tag = forwardRef<HTMLDivElement, DivAttributes & RepositoryTagProps>(
    ({ text, className = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`flex justify-center items-center py-1 px-2 rounded-full border border-mist-100 ${className}`}
                {...props}
            >
                <p>{text}</p>
            </div>
        );
    },
);

const RepositoryCard = forwardRef<
    HTMLDivElement,
    DivAttributes & RepositoryCardProps
>(({ repository, className = "", characterLimit = -1, ...props }, ref) => {
    const isTagged = () => {
        if (!repository) return false;
        return repository.archived || repository.fork;
    };

    return (
        <>
            {repository && (
                <div
                    className={`bg-stone-800 rounded-2xl flex flex-col p-7 gap-5 border-2 border-stone-500 shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] shadow-stone-400/50 shrink-0 ${className}`}
                    ref={ref}
                    {...props}
                >
                    <div className="flex flex-row gap-5">
                        <div className="flex flex-col gap-2 justify-start items-start">
                            <h1 className="text-4xl">{repository.name}</h1>
                            {repository.description && (
                                <p className="text-2xl max-w-100">
                                    {`"${repository.description == "null" ? "No description" : limitText(repository.description, characterLimit)}"`}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col justify-start items-center shrink-0">
                            <img
                                className="rounded-2xl aspect-square h-32"
                                src={`${repository.owner.avatar_url}&s=128`}
                            />
                        </div>
                    </div>
                    {isTagged() && (
                        <div className="flex flex-row gap-2">
                            {repository.archived && <Tag text="archived" />}
                            {repository.fork && <Tag text="forked" />}
                        </div>
                    )}
                </div>
            )}
        </>
    );
});

export default RepositoryCard;
