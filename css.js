import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    //app
    button: {
        marginRight: 15,
        backgroundColor: 'black',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5
    },
    text: {
        color: 'white',
        textAlign: 'center'
    },
    //home
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    containerFlat: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: 250,
        color: '#fff',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    itemContainer: {
        marginBottom: 16,
        backgroundColor: '#008000',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#008000',
        padding: 16,
        borderTopWidth: 3,
        borderTopColor: '#000',
    },
    footerButton: {
        flex: 1,
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: '#2E2E2E',
        padding: 16,
        borderRadius: 8,
        height: 150,
        width: '90%',
        alignSelf: 'center',
    },
    //details anime
    commentButtonTextModal: {
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 45,
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    imageDetails: {
        width: 200,
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
    },
    titleDetails: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#fff',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#fff',
    },
    successMessage: {
        position: 'absolute',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        borderWidth: 5,
        borderColor: 'black',
        alignSelf: 'center',
        zIndex: 1,
    },
    successMessageText: {
        color: 'white',
        fontWeight: 'bold',
    },
    //comment section
    containerComment: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 8,
        color: '#fff',
        fontSize: 16,
    },
    commentButton: {
        backgroundColor: '#008000',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        margin: 8,
        alignItems: 'center',
    },
    commentItem: {
        width: '100%',
        marginVertical: 8,
        padding: 8,
        backgroundColor: '#2E2E2E',
        borderRadius: 5,
        justifyContent: 'center',
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    commentUsername: {
        fontWeight: 'bold',
        color: '#fff',
    },
    commentDate: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    deleteButton: {
        backgroundColor: '#d10000',
        padding: 10,
        borderRadius: 5,
        marginRight: 8,
        color: '#fff',
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#008000',
        padding: 10,
        borderRadius: 5,
        color: '#fff',
        fontWeight: 'bold',
    },
    //login-singin
    containerIn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    titleIn: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    textLogin: {
        fontSize: 17,
        margin: 10,
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: 250,
        color: '#fff', // Testo bianco
    },
    //mylists
    firstTitle: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // Testo bianco
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '80%',
    },
    deleteButtonList: {
        backgroundColor: '#d10000',
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
        alignItems: 'center',
    },
    //settings
    containerSetting: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    titleSettings: {
        fontSize: 22,
        color: '#fff',
        marginBottom: 50,
        marginTop: 50,
        fontWeight: 'bold',
    },
    textSettings: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 30,
    },
    textDel: {
        fontSize: 15,
        color: '#fff',
    },
    buttonSettings: {
        backgroundColor: '#008000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 40,
    },
    deleteButtonSettings: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
})

export default styles