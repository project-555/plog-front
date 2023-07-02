export interface BlogUser {
    nickname: string
    profileImageURL: string
    userID: number
}

export interface Blog {
    blogID: number
    blogName: string
    introHtml: string
    blogUser: BlogUser

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
}