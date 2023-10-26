import {
    Alert,
    Avatar,
    Box,
    Divider,
    FormGroup,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Snackbar,
    TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Category} from "../../types/BlogType";
import {getErrorMessage, getPlogAxios} from "../../modules/axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import {repeatQuerySerializer} from "../../modules/serialize";

type CategoryListProps = {
    blogID: number
    setCategoryID: (categoryID: number | undefined) => void
    selectedCategoryID: number | undefined
    isBlogOwner: boolean
    setNeedPostingRefresh: (needRefresh: boolean) => void
}

export function CategoryList(props: CategoryListProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [needRefresh, setNeedRefresh] = useState<boolean>(true);
    const [addCategoryBtnClicked, setAddCategoryBtnClicked] = useState<boolean>(false);
    const [editCategoryName, setEditCategoryName] = useState<string>("" as string);
    const [editCategoryID, setEditCategoryID] = useState<number | null>(null);
    const [categoryName, setCategoryName] = useState<string>("");
    const [snackBarOpen, setSnackBarOpen] = useState<boolean>(false);
    const [snackBarMessage, setSnackBarMessage] = useState<string>("");
    const [snackBarSeverity, setSnackBarSeverity] = useState<"success" | "error" | "warning" | "info" | undefined>("success");
    const [postingCount, setPostingCount] = useState<number>(0);
    useEffect(() => {
        if (!needRefresh) return;

        getPlogAxios().get(`/blogs/${props.blogID}/categories`).then(
            (response: any) => {
                setCategories(response.data.categories as Category[]);
                setNeedRefresh(false)
            });

    }, [props.blogID, needRefresh]);

    const handleToggleCategoryID = (categoryID: number) => {
        if (props.selectedCategoryID === categoryID) {
            props.setCategoryID(undefined);
        } else {
            props.setCategoryID(categoryID);
        }
    }
    const handleOnClickEditCategoryBtn = (category: Category) => {
        if (editCategoryID === category.categoryID) {
            if (editCategoryName === null || editCategoryName.trim() === "") {
                setSnackBarMessage("카테고리 명을 입력해주세요.")
                setSnackBarSeverity("warning")
                setSnackBarOpen(true)
                return;
            }
            // 저장 로직 추가
            getPlogAxios().patch(`/blogs/${props.blogID}/categories/${category.categoryID}`, {
                categoryName: editCategoryName
            }).then(
                (response: any) => {
                    setNeedRefresh(true);
                    setEditCategoryID(null);
                    setEditCategoryName("");
                    setSnackBarMessage("카테고리가 수정되었습니다.")
                    setSnackBarSeverity("success")
                    setSnackBarOpen(true)
                }
            ).catch(
                (error: any) => {
                    setEditCategoryName("");
                    setSnackBarMessage(getErrorMessage(error))
                    setSnackBarSeverity("error")
                    setSnackBarOpen(true)
                }
            );
        } else {
            setEditCategoryName(category.categoryName);
            setEditCategoryID(category.categoryID);
        }
    }

    const handleOnClickDeleteCategoryBtn = async (category: Category) => {
        let postingCount = 0;

        // 포스팅 카운트를 가져옵니다.
        try {
            const response = await getPlogAxios().get(`/blogs/${props.blogID}/postings/count`, {
                params: {categoryIDs: [category.categoryID]},
                paramsSerializer: repeatQuerySerializer
            });
            postingCount = response.data.count;
            setPostingCount(postingCount); // 상태를 업데이트하면서 화면을 새로고침합니다.
        } catch (error) {
            console.error("Error fetching posting count:", error);
            // 에러 처리 로직
            return;
        }

        // 사용자에게 카테고리 삭제 확인
        const isConfirmed = window.confirm(
            `"${category.categoryName}" 카테고리를 삭제하시겠습니까?\n\n"${category.categoryName}"카테고리에 속한 ${postingCount}개의 포스팅이 삭제되며, 복구할 수 없습니다.`
        );

        if (!isConfirmed) return;

        // 카테고리를 삭제합니다.
        try {
            await getPlogAxios().delete(`/blogs/${props.blogID}/categories/${category.categoryID}`);
            setNeedRefresh(true);
            props.setNeedPostingRefresh(true);
        } catch (error) {
            console.log(error);
            // 에러 처리 로직
        }
    };


    const handleOnClickAddCategoryIconBtn = () => {
        if (categoryName === null || categoryName.trim() === "") {
            setSnackBarMessage("카테고리 명을 입력해주세요.")
            setSnackBarSeverity("warning")
            setSnackBarOpen(true)
            return;
        }

        getPlogAxios().post(`/blogs/${props.blogID}/categories`,
            {categoryName: categoryName}
        ).then(
            (response: any) => {
                setNeedRefresh(true)
                setAddCategoryBtnClicked(false)
                setCategoryName("")
                setSnackBarMessage("카테고리가 추가되었습니다.")
                setSnackBarSeverity("success")
                setSnackBarOpen(true)
            }
        ).catch(
            (error: any) => {
                setCategoryName("")
                setSnackBarMessage(getErrorMessage(error))
                setSnackBarSeverity("error")
                setSnackBarOpen(true)
            }
        );
    }

    const handleOnClickAddCategoryBtn = () => {
        setAddCategoryBtnClicked(true);
    }
    return (
        <Box>
            <List sx={{pt: 0}}>
                {categories.length > 0 && categories.map((category: Category) => (
                    <Box key={category.categoryID}>
                        <ListItem key={category.categoryID}
                                  sx={{
                                      padding: 1,
                                      margin: 1,
                                      ":hover": {
                                          backgroundColor: "#f5f5f5"
                                      }
                                  }}
                                  secondaryAction={
                                      <Box display={props.isBlogOwner ? "block" : "none"}>
                                          <IconButton onClick={() => handleOnClickEditCategoryBtn(category)}>
                                              {editCategoryID === category.categoryID ? <CheckIcon/> : <EditIcon/>}
                                          </IconButton>
                                          <IconButton onClick={() => handleOnClickDeleteCategoryBtn(category)}>
                                              <DeleteIcon/>
                                          </IconButton>
                                      </Box>
                                  }
                        >
                            {editCategoryID === category.categoryID && props.isBlogOwner ? (
                                <TextField
                                    InputProps={{style: {height: '40px'}}}
                                    InputLabelProps={{style: {top: '-16px'}}}
                                    value={editCategoryName}
                                    placeholder="카테고리 명"
                                    onChange={(e) => setEditCategoryName(e.target.value)}
                                />
                            ) : (
                                <Box
                                    onClick={() => handleToggleCategoryID(category.categoryID)}
                                    sx={{
                                        "height": "40px", "display": "flex", "alignItems": "center",
                                    }}
                                    fontWeight={props.selectedCategoryID === category.categoryID ? "bold" : "normal"}
                                >
                                    {category.categoryName}
                                </Box>
                            )}
                        </ListItem>
                        <Divider/>
                    </Box>
                ))}
                {
                    !addCategoryBtnClicked && props.isBlogOwner &&
                    <ListItem>
                        <ListItemButton onClick={handleOnClickAddCategoryBtn}>
                            <ListItemAvatar>
                                <Avatar sx={{width: "30px", height: "30px"}}>
                                    <AddIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="카테고리 추가"/>
                        </ListItemButton>
                    </ListItem>
                }
                {
                    addCategoryBtnClicked && props.isBlogOwner &&
                    <ListItem>
                        <Box display="flex" flexDirection="row">
                            <FormGroup>
                                <TextField
                                    InputProps={{style: {height: '40px'}}}
                                    InputLabelProps={{style: {top: '-16px'}}}
                                    value={categoryName}
                                    placeholder="카테고리 명"
                                    onChange={(e) => setCategoryName(e.target.value)}
                                />
                            </FormGroup>
                            <IconButton onClick={handleOnClickAddCategoryIconBtn}>
                                <AddIcon/>
                            </IconButton>
                        </Box>
                    </ListItem>
                }

            </List>
            <Snackbar open={snackBarOpen}
                      autoHideDuration={6000}
                      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                      onClose={() => setSnackBarOpen(false)}>
                <Alert severity={snackBarSeverity}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}