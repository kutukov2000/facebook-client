import { Flex, Grid, Layout, message } from "antd";
import "./CreateStoryPage.css";
import { Content } from "antd/es/layout/layout";
import { useAppSelector } from "../../../../hooks/redux";
import { apiClient } from "../../../../utils/api/apiClient";
import CreateStorySideBar from "./components/CreateStorySideBar";
import SelectStoryType from "./components/SelectStoryType";
import StoryPreview from "./components/StoryPreview";
import StorySettingsCard from "./components/StorySettingsCard";
import { CreateStoryProvider, useCreateStory } from "./context";
import useCapture from "./hooks/useCapture";

const CreateStoryContent = () => {
	const { user } = useAppSelector((state) => state.account);

	const { storyType, setStoryType, text } = useCreateStory();

	const { captureAreaRef, getCapture } = useCapture();

	const postStory = async () => {
		if (storyType == null) return;
		const story = await getCapture(storyType);

		const formData = new FormData();
		formData.append("Content", text ?? "");
		formData.append("Image", story as Blob);
		formData.append("UserId", user?.id ?? "");

		apiClient
			.post("/api/story/create", formData)
			.then((res) => {
				console.log(res);
				message.success("Story successfully posted!");
			})
			.catch((error) => {
				console.log(error);
				message.error("Post story error!");
			});
	};

	const screens = Grid.useBreakpoint();

	const isScreenSmallerThatMd =
		(screens.xs || screens.sm) &&
		!screens.md &&
		!screens.lg &&
		!screens.xl &&
		!screens.xxl;

	return (
		<Layout className="create-page-story-layout" style={{ height: "100%" }}>
			{!isScreenSmallerThatMd && <CreateStorySideBar postStory={postStory} />}
			<Content
				style={{
					marginLeft: !isScreenSmallerThatMd ? "35%" : 0,
				}}
				className="content"
			>
				{isScreenSmallerThatMd && (
					<StorySettingsCard
						isSmallerThatMdScreen={isScreenSmallerThatMd}
						postStory={postStory}
					/>
				)}
				<Flex
					gap="middle"
					className="create-story-page"
					style={{
						height: isScreenSmallerThatMd ? "fit-content" : "100%",
						marginTop: isScreenSmallerThatMd ? 20 : 0,
					}}
				>
					{storyType == null && <SelectStoryType setStoryType={setStoryType} />}

					{storyType != null && (
						<StoryPreview captureAreaRef={captureAreaRef} />
					)}
				</Flex>
			</Content>
		</Layout>
	);
};

const CreateStoryPage = () => (
	<CreateStoryProvider>
		<CreateStoryContent />
	</CreateStoryProvider>
);

export default CreateStoryPage;
