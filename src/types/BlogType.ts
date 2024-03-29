export interface BlogUser {
    nickname: string
    profileImageURL: string
    userID: number
}

export interface Blog {
    blogID: number
    blogName: string
    introHTML: string
    shortIntro: string
    blogUser: BlogUser

}

export interface PostingTag {
    tagID: number
    tagName: string
}

export interface Posting {
    id: number
    createDt: string
    updateDt: string
    categoryID: number
    htmlContent: string
    isCommentAllowed: boolean
    isStarAllowed: boolean
    starCnt: number
    stateID: number
    thumbnailImageURL: string
    title: string
    postingTags: PostingTag[]
}

export interface ListBlogPostingsRequest {
    blogID: number
    categoryID?: number
    lastCursorID?: number
    pageSize: number
    search?: string
    tagIDs?: number[]
}

export interface CreateCategoryRequest {
    categoryName: string
    categoryDesc: string
}

export interface Category {
    categoryID: number
    categoryName: string
    categoryDesc: string
}

export interface UpdateBlogRequest {
    introHTML?: string
    introMd?: string
    shortIntro?: string
}

export type BlogTag = {
    tagID: number
    tagName: string
}

