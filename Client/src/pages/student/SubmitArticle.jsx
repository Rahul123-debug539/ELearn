import { useEffect, useState, useRef, useMemo } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./SubmitArticle.css";
import { useNavigate } from "react-router-dom";

import ImageResize from "quill-image-resize-module-react";
import Quill from "quill";

Quill.register("modules/imageResize", ImageResize);

function SubmitArticle() {
    const quillRef = useRef(null);
    const navigate = useNavigate();

    // IMAGE HANDLER
    const imageHandler = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const data = new FormData();
            data.append("image", file);

            try {
                const res = await api.post(
                    "/api/upload/editor-image",
                    data
                );

                const imageUrl = res.data.url;

                const quill =
                    quillRef.current?.getEditor();

                if (!quill) return;

                const range =
                    quill.getSelection(true);

                quill.insertEmbed(
                    range.index,
                    "image",
                    imageUrl
                );

                quill.setSelection(
                    range.index + 1
                );

            } catch (err) {
                console.error(err);
                toast.error(
                    "Image upload failed"
                );
            }
        };
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline"],
                    [{ color: [] }],
                    ["blockquote", "code-block"],
                    [
                        { list: "ordered" },
                        { list: "bullet" }
                    ],
                    ["link", "image"],
                    ["clean"]
                ],
                handlers: {
                    image: imageHandler
                }
            },

            imageResize: {
                parchment:
                    Quill.import("parchment"),
                modules: [
                    "Resize",
                    "DisplaySize",
                    "Toolbar"
                ]
            }
        }),
        []
    );

    const [categories, setCategories] =
        useState([]);

    const [topics, setTopics] =
        useState([]);

    const [subtopics, setSubtopics] =
        useState([]);

    const [selectedCat, setSelectedCat] =
        useState("");

    const [selectedTopic, setSelectedTopic] =
        useState("");

    const [selectedSub, setSelectedSub] =
        useState("");

    const [title, setTitle] =
        useState("");

    const [fullContent, setFullContent] =
        useState("");

    const [images, setImages] =
        useState([]);

    const [videoUrl, setVideoUrl] =
        useState("");

    // LOAD CATEGORIES
    useEffect(() => {
        api.get("/api/categories")
            .then((res) => {
                if (res.data.status) {
                    setCategories(
                        res.data.categories
                    );
                }
            });
    }, []);

    // LOAD TOPICS
    useEffect(() => {
        if (!selectedCat) return;

        api.get(
            `/api/topics/${selectedCat}`
        ).then((res) => {
            if (res.data.status) {
                setTopics(res.data.topics);
            }
        });

    }, [selectedCat]);

    // LOAD SUBTOPICS
    useEffect(() => {
        if (!selectedTopic) return;

        api.get(
            `/api/subtopics/${selectedTopic}`
        ).then((res) => {
            if (res.data.status) {
                setSubtopics(
                    res.data.subtopics
                );
            }
        });

    }, [selectedTopic]);

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSub)
            return toast.error(
                "Select a Subtopic"
            );

        if (!title.trim())
            return toast.error(
                "Title is required"
            );

        if (!fullContent.trim())
            return toast.error(
                "Content is required"
            );

        try {
            const fd = new FormData();

            fd.append(
                "subtopicId",
                selectedSub
            );

            fd.append(
                "title",
                title
            );

            fd.append(
                "fullContent",
                fullContent
            );

            if (videoUrl) {
                fd.append(
                    "videoUrl",
                    videoUrl
                );
            }

            images.forEach((img) =>
                fd.append("images", img)
            );

            const res = await api.post(
                "/api/pending-article/create",
                fd,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            if (res.data.status) {

                toast.success(
                    "Article submitted successfully for review!"
                );

                setTitle("");
                setFullContent("");
                setImages([]);
                setVideoUrl("");

                navigate(
                    "/student/my-articles"
                );

            } else {
                toast.error(
                    res.data.message
                );
            }

        } catch (err) {
            console.error(err);

            toast.error(
                err?.response?.data?.message ||
                "Failed to submit article"
            );
        }
    };

    return (
        <div className="student-page">
            <h2>Submit New Article</h2>

            <select
                className="student-select"
                value={selectedCat}
                onChange={(e) =>
                    setSelectedCat(
                        e.target.value
                    )
                }
            >
                <option value="">
                    Select Category
                </option>

                {categories.map((cat) => (
                    <option
                        key={cat._id}
                        value={cat._id}
                    >
                        {cat.name}
                    </option>
                ))}
            </select>

            {selectedCat && (
                <select
                    className="student-select"
                    value={selectedTopic}
                    onChange={(e) =>
                        setSelectedTopic(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Select Topic
                    </option>

                    {topics.map((topic) => (
                        <option
                            key={topic._id}
                            value={topic._id}
                        >
                            {topic.name}
                        </option>
                    ))}
                </select>
            )}

            {selectedTopic && (
                <select
                    className="student-select"
                    value={selectedSub}
                    onChange={(e) =>
                        setSelectedSub(
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Select Subtopic
                    </option>

                    {subtopics.map((sub) => (
                        <option
                            key={sub._id}
                            value={sub._id}
                        >
                            {sub.name}
                        </option>
                    ))}
                </select>
            )}

            {selectedSub && (
                <form
                    className="student-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Article Title"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                        required
                    />

                    <ReactQuill
                        ref={quillRef}
                        value={fullContent}
                        onChange={
                            setFullContent
                        }
                        theme="snow"
                        modules={modules}
                        style={{
                            height: "300px",
                            marginBottom: "80px"
                        }}
                    />

                    <label>
                        Upload Images
                    </label>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                            setImages([
                                ...e.target.files
                            ])
                        }
                    />

                    {images.length > 0 && (
                        <div className="preview-box">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="preview-item"
                                >
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt="preview"
                                    />

                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => {
                                            const arr = [...images];
                                            arr.splice(idx, 1);
                                            setImages(arr);
                                        }}
                                    >
                                        ✖
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="YouTube Video URL"
                        value={videoUrl}
                        onChange={(e) =>
                            setVideoUrl(
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="submit"
                        className="student-btn"
                    >
                        Submit Article
                    </button>
                </form>
            )}
        </div>
    );
}

export default SubmitArticle;