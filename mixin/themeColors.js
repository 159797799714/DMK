export default {
	computed: {
		themeColor() {
			return this.$store.state.themeColor
		},
		letThemeColor() {
			return this.$store.state.letThemeColor
		}
	}
}