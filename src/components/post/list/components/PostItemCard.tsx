import {
	CommentOutlined,
	DeleteTwoTone,
	LikeFilled,
	SmileTwoTone,
} from "@ant-design/icons";
import {
	Avatar,
	Badge,
	Card,
	Carousel,
	Divider,
	Flex,
	Grid,
	Popconfirm,
	Tag,
	Tooltip,
	message,
} from "antd";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { APP_ENV } from "../../../../env";
import { useAppSelector } from "../../../../hooks/redux";
import { apiClient } from "../../../../utils/api/apiClient";
import { avatarImg, likeImg, locationImg } from "../../../../utils/images";
import Arrow from "../../../featured/arrow/Arrow";
import { getRandomTagColor } from "../../create/components/tags/TagsList";
import type { IComment, ILike, IPost } from "../types.ts";
import {
	getActionImage,
	getFeelingImage,
	getPublicationDate,
} from "../utils.ts";
import AddCommentForm from "./AddCommentForm";
import CommentsList from "./CommentsList";

type PostItemCardProps = {
	post: IPost;
	setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
	setTotalCount?: React.Dispatch<React.SetStateAction<number>>;
};

const PostItemCard = ({ post, setPosts, setTotalCount }: PostItemCardProps) => {
	const { user } = useAppSelector((state) => state.account);
	const [commentsVisibility, setCommentsVisibility] = useState<boolean>(false);
	const [comments, setComments] = useState<IComment[]>([]);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [showPicker, setShowPicker] = useState<boolean>(false);

	const screens = Grid.useBreakpoint();

	useEffect(() => {
		apiClient.get(`api/comment/${post.id}`).then((res) => {
			setComments(res.data);
		});

		for (const like of post.likes) {
			if (like.userId === user?.id) {
				setIsLiked(true);
				return;
			}
		}
	}, [post.id, post.likes, user]);

	if (!post || !post.user) {
		return null;
	}

	const likePost = () => {
		apiClient.post<ILike>("api/like", { postId: post.id }).then((res) => {
			setPosts((prevPosts) =>
				prevPosts.map((prevPost) =>
					prevPost.id === post.id
						? { ...post, likes: [...prevPost.likes, res.data] }
						: prevPost,
				),
			);
		});
	};

	const onEmojiClick = (event: EmojiClickData) => {
		const data = {
			postId: post.id,
			emoji: event.emoji,
		};
		apiClient.post("/api/reaction", data);
		setShowPicker(false);
	};

	const unlikePost = () => {
		try {
			apiClient.delete("/api/like", { data: { postId: post.id } });
			setIsLiked(false);

			setPosts((prevPosts) =>
				prevPosts.map((prevPost) =>
					prevPost.id === post.id
						? {
								...prevPost,
								likes: prevPost.likes.filter(
									(like) => like.userId !== user?.id,
								),
							}
						: prevPost,
				),
			);
		} catch (error) {
			message.error("Unlike post error!");
		}
	};

	const deletePost = () => {
		try {
			apiClient.delete("api/post", { data: { id: post.id } });
			setPosts((prevPosts) =>
				prevPosts.filter((postFromList) => postFromList.id !== post.id),
			);
			if (setTotalCount) setTotalCount((totalCount) => totalCount - 1);
			message.success("Post successfully deleted!");
		} catch (error) {
			message.error("Post deletion error!");
		}
	};

	const isScreenSmallerThatMd =
		(screens.xs || screens.sm) &&
		!screens.md &&
		!screens.lg &&
		!screens.xl &&
		!screens.xxl;

	return (
		<Card
			key={post.id}
			className="card-container"
			style={{
				maxWidth: "600px",
				width: "100%",
				margin: "auto",
				position: "relative",
			}}
		>
			{isScreenSmallerThatMd && (
				<Flex
					justify="space-between"
					style={{ width: "100%", marginBottom: 5 }}
				>
					{post.user.isOnline && <Badge color="green" count={"online"} />}
					{post.userId === user?.id && (
						<Popconfirm
							title="Delete post ?"
							onConfirm={deletePost}
							okText="Yes"
							cancelText="No"
						>
							<DeleteTwoTone />
						</Popconfirm>
					)}
				</Flex>
			)}

			<Flex vertical gap="small">
				<Flex justify="space-between">
					<Flex align="center" gap="small">
						<NavLink to={`/profile?userId=${post.user.id}`}>
							<Avatar
								size={60}
								src={
									post.user.avatar === null
										? avatarImg
										: `${APP_ENV.BASE_URL}/images/avatars/${post.user.avatar}`
								}
							/>
						</NavLink>
						<Flex vertical>
							<Flex align="center" gap="small">
								<NavLink
									to={`/profile?userId=${post.user.id}`}
									style={{ color: "black" }}
								>
									<span style={{ fontWeight: 600, fontSize: 20 }}>
										{`${post.user.firstName} ${post.user.lastName}`}
									</span>
								</NavLink>
							</Flex>
							<span>{getPublicationDate(post.createdAt)}</span>
						</Flex>
						{!isScreenSmallerThatMd && (
							<>
								{post.user.isOnline ? (
									<Badge color="green" count={"online"} />
								) : (
									<Badge color="gray" count={"offline"} />
								)}
							</>
						)}
					</Flex>
					{!isScreenSmallerThatMd && (
						<Flex justify="end">
							{post.userId === user?.id && (
								<Popconfirm
									title="Delete post ?"
									onConfirm={deletePost}
									okText="Yes"
									cancelText="No"
								>
									<DeleteTwoTone style={{ fontSize: 18 }} />
								</Popconfirm>
							)}
						</Flex>
					)}
				</Flex>

				<Divider style={{ margin: 0 }} />

				{post.action && (
					<Flex align="center" gap="small">
						<img
							src={getActionImage(post.action, post.subAction)}
							alt="Action icon"
							style={{ height: 35, width: 35 }}
						/>
						<span>{post.action.name}</span>

						{post.subAction && <span>{post.subAction.name}</span>}
					</Flex>
				)}

				{post.feeling && (
					<Flex align="center" gap="small">
						<img
							src={getFeelingImage(post.feeling)}
							alt="Feeling icon"
							style={{ height: 35, width: 35 }}
						/>
						<span>{post.feeling.name}</span>
					</Flex>
				)}

				<Carousel
					arrows
					draggable
					infinite
					nextArrow={<Arrow direction="right" />}
					prevArrow={<Arrow direction="left" />}
				>
					{post.images.map((image) => (
						<img
							key={image.id}
							src={`${APP_ENV.BASE_URL}/images/posts/${image.imagePath}`}
							className="post-preview-img"
							alt="Post images"
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					))}
				</Carousel>

				{post.location && (
					<Flex align="center" gap="small">
						<img src={locationImg} height={35} alt="Location icon" />
						<span>{post.location}</span>
					</Flex>
				)}

				{post.content !== "undefined" && (
					<p style={{ margin: 0 }}>{post.content}</p>
				)}

				{post.tags && (
					<Flex wrap="wrap" gap="small">
						{post.tags.map((tag) => (
							<Tag
								key={tag}
								color={getRandomTagColor()}
								style={{
									margin: 0,
									width: "fit-content",
									fontSize: "14px",
								}}
							>
								{`#${tag}`}
							</Tag>
						))}
					</Flex>
				)}

				<Flex gap="small">
					{isLiked ? (
						<Tooltip title="Unlike post">
							<Flex className="post-actions-flex" onClick={unlikePost}>
								<LikeFilled style={{ color: "red" }} />
								<span>{post.likes.length}</span>
							</Flex>
						</Tooltip>
					) : (
						<Flex className="post-actions-flex" onClick={likePost}>
							<img src={likeImg} alt="Like" width={30} />
							<span>{post.likes.length}</span>
						</Flex>
					)}
					<Flex
						className="post-actions-flex"
						onClick={() => setShowPicker(!showPicker)}
					>
						<SmileTwoTone style={{ fontSize: 20 }} />
						<span>Reactions</span>
					</Flex>

					<Tooltip
						title={commentsVisibility ? "Hide comments" : "Show comments"}
					>
						<Flex
							gap="small"
							className="post-actions-flex"
							onClick={() => setCommentsVisibility(!commentsVisibility)}
						>
							<CommentOutlined />
							<span>{comments.length > 0 ? comments.length : ""}</span>
						</Flex>
					</Tooltip>
				</Flex>
				<EmojiPicker open={showPicker} onEmojiClick={onEmojiClick} />

				<AddCommentForm post={post} setComments={setComments} />

				{commentsVisibility && (
					<CommentsList comments={comments} setComments={setComments} />
				)}
			</Flex>
		</Card>
	);
};

export default PostItemCard;
